import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getPaymentProvider } from "@/lib/payment";
import type { NormalizedEventType } from "@/lib/payment/types";

// Paddle 웹훅 이벤트 타입
interface PaddleWebhookEvent {
  event_id: string;
  event_type: string;
  occurred_at: string;
  notification_id: string;
  data: {
    id: string;
    status: string;
    customer_id: string;
    currency_code: string;
    items: Array<{
      price: {
        id: string;
        product_id: string;
        description: string;
      };
      quantity: number;
    }>;
    custom_data?: {
      user_id?: string;
    };
    current_billing_period?: {
      starts_at: string;
      ends_at: string;
    };
    scheduled_change?: {
      action: string;
      effective_at: string;
    } | null;
    management_urls?: {
      update_payment_method?: string;
      cancel?: string;
    };
    // Transaction 관련
    subscription_id?: string;
    payments?: Array<{
      payment_method_id: string;
      amount: string;
      status: string;
    }>;
  };
}

// Paddle 상태를 정규화된 구독 상태로 매핑
function mapPaddleStatus(
  status: string,
  scheduledChange?: { action: string } | null
): string {
  // 취소 예약된 경우
  if (scheduledChange?.action === "cancel") {
    return "active"; // 아직 활성 상태이지만 cancel_at_period_end = true
  }

  const statusMap: Record<string, string> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    paused: "paused",
    canceled: "canceled",
  };

  return statusMap[status] || "active";
}

// Paddle 이벤트 타입을 정규화
function mapPaddleEventType(eventType: string): NormalizedEventType {
  const eventMap: Record<string, NormalizedEventType> = {
    "subscription.created": "subscription.created",
    "subscription.updated": "subscription.updated",
    "subscription.canceled": "subscription.canceled",
    "subscription.paused": "subscription.paused",
    "subscription.resumed": "subscription.resumed",
    "transaction.completed": "payment.success",
    "transaction.payment_failed": "payment.failed",
  };

  return eventMap[eventType] || "unknown";
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("paddle-signature") || "";

  // 시그니처 검증
  const paddleProvider = getPaymentProvider("paddle");
  const verification = paddleProvider.verifyWebhookSignature(
    payload,
    signature
  );

  if (!verification.valid) {
    console.error("Invalid Paddle webhook signature:", verification.error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event: PaddleWebhookEvent = JSON.parse(payload);
  const eventType = event.event_type;
  const normalizedEventType = mapPaddleEventType(eventType);

  // Admin Client 사용 (RLS 우회)
  const supabase = createAdminClient();

  console.log(`Processing Paddle webhook: ${eventType}`);

  // 멱등성: 이벤트 ID로 중복 처리 방지
  const eventId = event.event_id;

  const { error: insertError } = await supabase
    .from("paddle_webhook_events")
    .upsert(
      {
        event_id: eventId,
        event_type: eventType,
        payload: event,
        status: "pending",
      },
      { onConflict: "event_id", ignoreDuplicates: true }
    );

  if (insertError) {
    console.error("Error logging Paddle webhook event:", insertError);
  }

  // 이미 처리된 이벤트인지 확인
  const { data: existingEvent } = await supabase
    .from("paddle_webhook_events")
    .select("status")
    .eq("event_id", eventId)
    .single();

  if (existingEvent?.status === "processed") {
    console.log(`Paddle event ${eventId} already processed.`);
    return NextResponse.json(
      { message: "Event already processed" },
      { status: 200 }
    );
  }

  try {
    switch (normalizedEventType) {
      case "subscription.created": {
        const data = event.data;
        const userId = data.custom_data?.user_id;

        if (userId) {
          const planItem = data.items?.[0];
          const planName = planItem?.price?.description || "Unknown Plan";
          const planId = planItem?.price?.id || "";

          const { error: upsertError } = await supabase
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                paddle_customer_id: data.customer_id,
                paddle_subscription_id: data.id,
                payment_provider: "paddle",
                status: mapPaddleStatus(
                  data.status,
                  data.scheduled_change
                ),
                plan_id: planId,
                plan_name: planName,
                current_period_start:
                  data.current_billing_period?.starts_at || null,
                current_period_end:
                  data.current_billing_period?.ends_at || null,
                cancel_at_period_end:
                  data.scheduled_change?.action === "cancel",
              },
              { onConflict: "paddle_subscription_id" }
            );

          if (upsertError) {
            console.error("Paddle subscription upsert error:", upsertError);
          }
        }
        break;
      }

      case "subscription.updated": {
        const data = event.data;
        const planItem = data.items?.[0];
        const planName = planItem?.price?.description || "Unknown Plan";
        const planId = planItem?.price?.id || "";

        await supabase
          .from("subscriptions")
          .update({
            status: mapPaddleStatus(data.status, data.scheduled_change),
            plan_id: planId,
            plan_name: planName,
            current_period_start:
              data.current_billing_period?.starts_at || null,
            current_period_end:
              data.current_billing_period?.ends_at || null,
            cancel_at_period_end:
              data.scheduled_change?.action === "cancel",
          })
          .eq("paddle_subscription_id", data.id);
        break;
      }

      case "subscription.canceled": {
        const data = event.data;

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            cancel_at_period_end: false,
          })
          .eq("paddle_subscription_id", data.id);
        break;
      }

      case "subscription.paused": {
        const data = event.data;

        await supabase
          .from("subscriptions")
          .update({
            status: "paused",
          })
          .eq("paddle_subscription_id", data.id);
        break;
      }

      case "subscription.resumed": {
        const data = event.data;

        await supabase
          .from("subscriptions")
          .update({
            status: "active",
          })
          .eq("paddle_subscription_id", data.id);
        break;
      }

      case "payment.success": {
        const data = event.data;
        // transaction.completed 이벤트 - 구독 결제 성공
        if (data.subscription_id) {
          await supabase
            .from("subscriptions")
            .update({ status: "active" })
            .eq("paddle_subscription_id", data.subscription_id);
        }
        break;
      }

      case "payment.failed": {
        const data = event.data;
        // transaction.payment_failed 이벤트 - 결제 실패
        if (data.subscription_id) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("paddle_subscription_id", data.subscription_id);
        }
        break;
      }

      default:
        console.log(`Unhandled Paddle event: ${eventType}`);
    }

    // 이벤트 처리 완료 표시
    await supabase
      .from("paddle_webhook_events")
      .update({
        status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("event_id", eventId);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";
    console.error("Paddle Webhook Error:", err);

    // 에러 발생 시 실패 표시
    await supabase
      .from("paddle_webhook_events")
      .update({
        status: "failed",
        processed_at: new Date().toISOString(),
        error_message: errorMessage,
      })
      .eq("event_id", eventId);

    return NextResponse.json(
      { message: "Webhook Handler Error" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Webhook received" },
    { status: 200 }
  );
}

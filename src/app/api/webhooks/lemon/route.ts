import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";
import { lemonConfig } from "@/lib/lemon/client";

// LemonSqueezy Webhook 이벤트 타입
type WebhookEvent = {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      order_id?: number;
      product_id?: number;
      variant_id?: number;
      product_name?: string;
      variant_name?: string;
      user_name: string;
      user_email: string;
      status: string;
      status_formatted: string;
      card_brand?: string;
      card_last_four?: string;
      pause?: null | { mode: string; resumes_at: string };
      cancelled?: boolean;
      trial_ends_at?: string | null;
      billing_anchor?: number;
      renews_at?: string;
      ends_at?: string | null;
      created_at: string;
      updated_at: string;
      test_mode: boolean;

      // Subscription Invoice specific fields
      subscription_id?: number;

      // Order specific fields
      total: number;
      currency: string;
      total_formatted: string;
      first_order_item?: {
        id: number;
        order_id: number;
        product_id: number;
        variant_id: number;
        product_name: string;
        variant_name: string;
        price: number;
      };

      urls: {
        update_payment_method: string;
        customer_portal: string;
        receipt: string;
      };
    };
  };
};

// 구독 상태 매핑
function mapLemonStatus(status: string, cancelled: boolean): string {
  if (cancelled) return "canceled";

  const statusMap: Record<string, string> = {
    on_trial: "trialing",
    active: "active",
    paused: "paused",
    past_due: "past_due",
    unpaid: "unpaid",
    cancelled: "canceled",
    expired: "canceled",
  };

  return statusMap[status] || "active";
}

// 웹훅 시그니처 검증
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("x-signature") || "";

  // 시그니처 검증
  if (!verifyWebhookSignature(payload, signature, lemonConfig.webhookSecret)) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event: WebhookEvent = JSON.parse(payload);
  const eventName = event.meta.event_name;

  // Admin Client 사용 (RLS 우회)
  const supabase = createAdminClient();

  console.log(`Processing LemonSqueezy webhook: ${eventName}`);

  // Idempotency: Use original event ID to handle retries correctly
  const eventId = event.data.id;

  // Log event with ON CONFLICT DO NOTHING behavior
  // Supabase JS doesn't have .ignore(), so we use .select() with upsert or ignore error manually
  const { error: insertError } = await supabase
    .from("lemon_webhook_events")
    .upsert(
      {
        event_id: eventId,
        event_type: eventName,
        payload: event,
        status: "pending",
      },
      { onConflict: "event_id", ignoreDuplicates: true }
    );

  if (insertError) {
    console.error("Error logging webhook event:", insertError);
  }

  // Check if already processed
  const { data: existingEvent } = await supabase
    .from("lemon_webhook_events")
    .select("status")
    .eq("event_id", eventId)
    .single();

  if (existingEvent?.status === "processed") {
    console.log(`Event ${eventId} already processed.`);
    return NextResponse.json(
      { message: "Event already processed" },
      { status: 200 }
    );
  }

  try {
    switch (eventName) {
      case "subscription_created": {
        const attrs = event.data.attributes;
        const userId = event.meta.custom_data?.user_id;

        if (userId) {
          const { error: upsertError } = await supabase
            .from("subscriptions")
            .upsert(
              {
                user_id: userId,
                lemon_customer_id: attrs.customer_id.toString(),
                lemon_subscription_id: event.data.id,
                status: mapLemonStatus(attrs.status, attrs.cancelled ?? false),
                plan_id: (attrs.variant_id ?? 0).toString(),
                plan_name: `${attrs.product_name ?? "Unknown"} - ${attrs.variant_name ?? "Default"}`,
                current_period_end: attrs.renews_at,
                cancel_at_period_end: attrs.cancelled ?? false,
              },
              { onConflict: "lemon_subscription_id" } // lemon_subscription_id는 UNIQUE
            );
          if (upsertError) {
            console.error("Subscription upsert error:", upsertError);
          }
        }
        break;
      }

      case "subscription_updated": {
        const attrs = event.data.attributes;

        await supabase
          .from("subscriptions")
          .update({
            status: mapLemonStatus(attrs.status, attrs.cancelled ?? false),
            plan_id: (attrs.variant_id ?? 0).toString(),
            plan_name: `${attrs.product_name ?? "Unknown"} - ${attrs.variant_name ?? "Default"}`,
            current_period_end: attrs.renews_at,
            cancel_at_period_end: attrs.cancelled ?? false,
          })
          .eq("lemon_subscription_id", event.data.id);
        break;
      }

      case "subscription_cancelled": {
        // ends_at이 미래면 취소 예정, 과거면 완전 취소
        const endsAt = event.data.attributes.ends_at;
        const isStillActive = endsAt && new Date(endsAt) > new Date();

        if (isStillActive) {
          // 기간이 남았으면 취소 예정 상태 (아직 active)
          await supabase
            .from("subscriptions")
            .update({
              cancel_at_period_end: true,
              current_period_end: endsAt,
            })
            .eq("lemon_subscription_id", event.data.id);
        } else {
          // 기간 끝났으면 완전 취소
          await supabase
            .from("subscriptions")
            .update({
              status: "canceled",
              cancel_at_period_end: false,
            })
            .eq("lemon_subscription_id", event.data.id);
        }
        break;
      }

      case "subscription_payment_success": {
        // subscription-invoice 이벤트는 data.id가 invoice ID이므로 attributes.subscription_id 사용
        const subscriptionId =
          event.data.attributes.subscription_id?.toString() || event.data.id;
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("lemon_subscription_id", subscriptionId);
        break;
      }

      case "subscription_payment_failed": {
        const subscriptionId =
          event.data.attributes.subscription_id?.toString() || event.data.id;
        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("lemon_subscription_id", subscriptionId);
        break;
      }

      case "subscription_paused": {
        await supabase
          .from("subscriptions")
          .update({ status: "paused" })
          .eq("lemon_subscription_id", event.data.id);
        break;
      }

      case "subscription_unpaused": {
        await supabase
          .from("subscriptions")
          .update({ status: "active" })
          .eq("lemon_subscription_id", event.data.id);
        break;
      }

      // --- 일회성 결제 (One-Time Payments) ---

      case "order_created": {
        const attrs = event.data.attributes;
        const userId = event.meta.custom_data?.user_id;

        // 구독 결제가 아닌 경우에만 처리 (구독은 subscription_created에서 처리됨)
        // LemonSqueezy에서는 구독 첫 결제도 order_created를 발생시키지만,
        // 여기서는 식별을 위해 간단히 처리하거나, 중복을 허용할 수도 있음.
        // 보통 'first_subscription_item'이 null이면 일회성 결제임.
        if (userId) {
          await supabase.from("purchases").upsert(
            {
              user_id: userId,
              lemon_order_id: event.data.id,
              lemon_customer_id: attrs.customer_id.toString(),
              product_name:
                attrs.first_order_item?.product_name || "Unknown Product",
              variant_name:
                attrs.first_order_item?.variant_name || "Unknown Variant",
              amount: attrs.total,
              currency: attrs.currency,
              status: attrs.status,
              receipt_url: attrs.urls.receipt,
            },
            { onConflict: "lemon_order_id" }
          );
        }
        break;
      }

      case "order_refunded": {
        await supabase
          .from("purchases")
          .update({ status: "refunded" })
          .eq("lemon_order_id", event.data.id);
        break;
      }

      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    // 이벤트 처리 완료 표시
    await supabase
      .from("lemon_webhook_events")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("event_id", eventId);
  } catch (err: any) {
    console.error("Webhook Error:", err);
    // 에러 발생 시 처리 실패 표시
    await supabase
      .from("lemon_webhook_events")
      .update({
        status: "failed",
        processed_at: new Date().toISOString(),
        error_message: err.message || "Unknown error",
      })
      .eq("event_id", eventId);

    return Response.json({ message: "Webhook Handler Error" }, { status: 500 });
  }

  return Response.json({ message: "Webhook received" }, { status: 200 });
}

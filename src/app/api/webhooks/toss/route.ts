import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  verifyWebhookSignature,
  type TossWebhookEvent,
  type TossWebhookEventType,
} from "@/lib/payment/providers/toss";

// 토스페이먼츠 결제 상태 → 내부 상태 매핑
function mapTossStatus(eventType: TossWebhookEventType): string {
  const statusMap: Record<TossWebhookEventType, string> = {
    DONE: "paid",
    CANCELED: "refunded",
    PARTIAL_CANCELED: "partial_refunded",
    ABORTED: "failed",
    EXPIRED: "expired",
  };

  return statusMap[eventType] || "unknown";
}

export async function POST(req: NextRequest) {
  const payload = await req.text();
  // 공식 문서 기준 헤더: tosspayments-webhook-signature
  // 참고: 결제 이벤트(DONE, CANCELED 등)에는 시그니처 헤더가 없을 수 있음
  const signature = req.headers.get("tosspayments-webhook-signature") || "";
  const transmissionTime =
    req.headers.get("tosspayments-webhook-transmission-time") || "";

  // 시그니처 검증 (시그니처가 있는 경우에만)
  if (signature && !verifyWebhookSignature(payload, signature, transmissionTime)) {
    console.error("Invalid toss webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event: TossWebhookEvent = JSON.parse(payload);
  const eventType = event.eventType;
  const paymentData = event.data;

  // Admin Client 사용 (RLS 우회)
  const supabase = createAdminClient();

  console.log(`Processing TossPayments webhook: ${eventType}`);

  // Idempotency: paymentKey를 이벤트 ID로 사용
  const eventId = `toss_${paymentData.paymentKey}_${eventType}`;

  // 이벤트 로깅
  const { error: insertError } = await supabase
    .from("toss_webhook_events")
    .upsert(
      {
        event_id: eventId,
        event_type: eventType,
        payment_key: paymentData.paymentKey,
        order_id: paymentData.orderId,
        payload: event,
        status: "pending",
      },
      { onConflict: "event_id", ignoreDuplicates: true }
    );

  if (insertError) {
    console.error("Error logging toss webhook event:", insertError);
  }

  // 이미 처리된 이벤트 확인
  const { data: existingEvent } = await supabase
    .from("toss_webhook_events")
    .select("status")
    .eq("event_id", eventId)
    .single();

  if (existingEvent?.status === "processed") {
    console.log(`Toss event ${eventId} already processed.`);
    return NextResponse.json(
      { message: "Event already processed" },
      { status: 200 }
    );
  }

  try {
    // orderId에서 userId 추출: order_{userId}_{timestamp}
    const orderIdParts = paymentData.orderId.split("_");
    const userId =
      orderIdParts.length >= 3
        ? orderIdParts.slice(1, -1).join("_")
        : null;

    switch (eventType) {
      case "DONE": {
        // 결제 완료
        if (userId) {
          await supabase.from("purchases").upsert(
            {
              user_id: userId,
              toss_payment_key: paymentData.paymentKey,
              toss_order_id: paymentData.orderId,
              product_name: paymentData.orderName,
              amount: paymentData.totalAmount,
              currency: paymentData.currency || "KRW",
              status: "paid",
              payment_provider: "toss",
              payment_method: paymentData.method,
              receipt_url: paymentData.receipt?.url || null,
              approved_at: paymentData.approvedAt,
            },
            { onConflict: "toss_order_id" }
          );

          // 구독 결제인 경우 구독 상태 업데이트
          const { data: existingSub } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("user_id", userId)
            .eq("payment_provider", "toss")
            .single();

          if (existingSub) {
            const nextPeriodEnd = new Date();
            nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

            await supabase
              .from("subscriptions")
              .update({
                status: "active",
                current_period_end: nextPeriodEnd.toISOString(),
              })
              .eq("user_id", userId)
              .eq("payment_provider", "toss");
          }
        }
        break;
      }

      case "CANCELED": {
        // 전액 취소
        await supabase
          .from("purchases")
          .update({ status: "refunded" })
          .eq("toss_payment_key", paymentData.paymentKey);

        // 구독이 있으면 취소 처리
        if (userId) {
          await supabase
            .from("subscriptions")
            .update({ status: "canceled", cancel_at_period_end: false })
            .eq("user_id", userId)
            .eq("payment_provider", "toss");
        }
        break;
      }

      case "PARTIAL_CANCELED": {
        // 부분 취소
        const refundableAmount =
          paymentData.cancels?.[0]?.refundableAmount ?? 0;
        await supabase
          .from("purchases")
          .update({
            status: "partial_refunded",
            amount: refundableAmount,
          })
          .eq("toss_payment_key", paymentData.paymentKey);
        break;
      }

      case "ABORTED": {
        // 결제 실패
        await supabase
          .from("purchases")
          .update({ status: "failed" })
          .eq("toss_payment_key", paymentData.paymentKey);

        // 구독 결제 실패 시 상태 업데이트
        if (userId) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("user_id", userId)
            .eq("payment_provider", "toss");
        }
        break;
      }

      case "EXPIRED": {
        // 결제 만료 (가상계좌 입금 기한 초과 등)
        await supabase
          .from("purchases")
          .update({ status: "expired" })
          .eq("toss_payment_key", paymentData.paymentKey);
        break;
      }

      default:
        console.log(`Unhandled toss event: ${eventType}`);
    }

    // 이벤트 처리 완료 표시
    await supabase
      .from("toss_webhook_events")
      .update({
        status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("event_id", eventId);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";
    console.error("Toss Webhook Error:", err);

    // 에러 발생 시 처리 실패 표시
    await supabase
      .from("toss_webhook_events")
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

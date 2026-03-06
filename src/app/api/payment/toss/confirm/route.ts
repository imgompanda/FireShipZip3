import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { confirmPayment } from "@/lib/payment/providers/toss";

/**
 * 토스페이먼츠 결제 승인 API
 *
 * 결제 플로우:
 * 1. 클라이언트에서 토스 SDK로 결제 요청
 * 2. 결제 성공 시 successUrl로 리다이렉트 (paymentKey, orderId, amount 파라미터)
 * 3. success 라우트에서 이 confirm API를 호출하여 최종 승인
 * 4. 승인 성공 시 DB에 저장
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "paymentKey, orderId, amount는 필수입니다" },
        { status: 400 }
      );
    }

    // orderId에서 userId 추출: order_{userId}_{timestamp}
    const orderIdParts = orderId.split("_");
    const userId =
      orderIdParts.length >= 3
        ? orderIdParts.slice(1, -1).join("_")
        : null;

    if (!userId) {
      return NextResponse.json(
        { error: "유효하지 않은 주문 ID입니다" },
        { status: 400 }
      );
    }

    // 토스 API로 결제 승인
    const payment = await confirmPayment(paymentKey, orderId, amount);

    // Admin Client로 DB 저장 (webhook보다 먼저 도달할 수 있으므로)
    const supabase = createAdminClient();

    if (payment.status === "DONE") {
      await supabase.from("purchases").upsert(
        {
          user_id: userId,
          toss_payment_key: paymentKey,
          toss_order_id: orderId,
          product_name: payment.orderName,
          amount: payment.totalAmount,
          currency: payment.currency || "KRW",
          status: "paid",
          payment_provider: "toss",
          payment_method: payment.method,
          receipt_url: payment.receipt?.url || null,
          approved_at: payment.approvedAt,
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

    return NextResponse.json({
      success: true,
      payment: {
        paymentKey: payment.paymentKey,
        orderId: payment.orderId,
        orderName: payment.orderName,
        totalAmount: payment.totalAmount,
        status: payment.status,
        method: payment.method,
        approvedAt: payment.approvedAt,
      },
    });
  } catch (err) {
    console.error("Toss payment confirm API error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "결제 승인에 실패했습니다";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

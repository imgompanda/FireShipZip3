import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { confirmPayment } from "@/lib/payment/providers/toss";

/**
 * 토스페이먼츠 결제 성공 콜백 핸들러
 *
 * 토스 SDK에서 결제 성공 시 이 URL로 리다이렉트됩니다.
 * 쿼리 파라미터: paymentKey, orderId, amount
 *
 * 1. 파라미터 검증
 * 2. 토스 API로 결제 승인 요청
 * 3. DB에 결제 정보 저장
 * 4. 대시보드로 리다이렉트
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const origin = req.nextUrl.origin;

  // 필수 파라미터 검증
  if (!paymentKey || !orderId || !amount) {
    console.error("Missing required parameters for toss payment success");
    return NextResponse.redirect(
      `${origin}/dashboard?error=missing_params`
    );
  }

  const numericAmount = parseInt(amount, 10);
  if (isNaN(numericAmount)) {
    console.error("Invalid amount parameter:", amount);
    return NextResponse.redirect(
      `${origin}/dashboard?error=invalid_amount`
    );
  }

  // orderId에서 userId 추출: order_{userId}_{timestamp}
  const orderIdParts = orderId.split("_");
  const userId =
    orderIdParts.length >= 3
      ? orderIdParts.slice(1, -1).join("_")
      : null;

  if (!userId) {
    console.error("Invalid orderId format:", orderId);
    return NextResponse.redirect(
      `${origin}/dashboard?error=invalid_order`
    );
  }

  try {
    // 토스 API로 결제 승인
    const payment = await confirmPayment(paymentKey, orderId, numericAmount);

    // Admin Client로 DB 저장
    const supabase = createAdminClient();

    if (payment.status === "DONE") {
      // 결제 정보 저장
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

      // 구독 결제인 경우 상태 업데이트
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

    // 성공 시 대시보드로 리다이렉트
    return NextResponse.redirect(
      `${origin}/dashboard?success=true&provider=toss`
    );
  } catch (err) {
    console.error("Toss payment success handler error:", err);

    const errorMessage =
      err instanceof Error ? err.message : "payment_confirm_failed";

    return NextResponse.redirect(
      `${origin}/dashboard?error=${encodeURIComponent(errorMessage)}`
    );
  }
}

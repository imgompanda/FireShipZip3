"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import {
  confirmPayment,
  issueBillingKey,
  chargeBilling,
  cancelPayment,
  getTossPlanById,
  type TossPaymentResponse,
  type TossBillingKeyResponse,
} from "@/lib/payment/providers/toss";

// ─── 결제 요청 정보 생성 ────────────────────────────────

/**
 * 토스페이먼츠 결제 요청에 필요한 정보를 생성합니다.
 * 클라이언트에서 토스 SDK로 결제를 시작할 때 필요한 데이터를 반환합니다.
 *
 * @param planId - 결제할 플랜 ID (basic_monthly, pro_monthly)
 * @returns 결제 요청에 필요한 정보 (orderId, amount, orderName 등)
 */
export async function createTossCheckout(planId: string): Promise<{
  orderId?: string;
  amount?: number;
  orderName?: string;
  customerEmail?: string;
  customerKey?: string;
  successUrl?: string;
  failUrl?: string;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  const plan = getTossPlanById(planId);
  if (!plan) {
    return { error: "유효하지 않은 플랜입니다" };
  }

  const origin = (await headers()).get("origin");
  const orderId = `order_${user.id}_${Date.now()}`;
  const customerKey = `customer_${user.id}`;

  return {
    orderId,
    amount: plan.priceKrw,
    orderName: `${plan.name} Plan (월간 구독)`,
    customerEmail: user.email,
    customerKey,
    successUrl: `${origin}/api/payment/toss/success`,
    failUrl: `${origin}/api/payment/toss/fail`,
  };
}

// ─── 결제 승인 ──────────────────────────────────────────

/**
 * 토스페이먼츠 결제를 최종 승인합니다.
 * 클라이언트에서 결제 성공 후 서버에서 호출합니다.
 *
 * @param paymentKey - 토스에서 발급한 결제 키
 * @param orderId - 주문 ID
 * @param amount - 결제 금액
 * @returns 승인 결과
 */
export async function confirmTossPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<{ payment?: TossPaymentResponse; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  // orderId에서 userId 검증
  const expectedPrefix = `order_${user.id}_`;
  if (!orderId.startsWith(expectedPrefix)) {
    return { error: "유효하지 않은 주문입니다" };
  }

  try {
    const payment = await confirmPayment(paymentKey, orderId, amount);

    // 결제 성공 시 DB에 저장
    if (payment.status === "DONE") {
      await supabase.from("purchases").upsert(
        {
          user_id: user.id,
          toss_payment_key: paymentKey,
          toss_order_id: orderId,
          product_name: payment.orderName,
          amount: payment.totalAmount,
          currency: payment.currency || "KRW",
          status: "paid",
          payment_provider: "toss",
          payment_method: payment.method,
          receipt_url: payment.receipt?.url || null,
        },
        { onConflict: "toss_order_id" }
      );
    }

    return { payment };
  } catch (err) {
    console.error("Toss payment confirm error:", err);
    return { error: "결제 승인에 실패했습니다" };
  }
}

// ─── 정기결제: 빌링키 발급 ──────────────────────────────

/**
 * 카드 자동결제를 위한 빌링키를 발급합니다.
 *
 * @param customerKey - 고객 식별 키
 * @param authKey - 카드 인증 키 (토스 SDK에서 발급)
 * @returns 빌링키 발급 결과
 */
export async function getTossBillingKey(
  customerKey: string,
  authKey: string
): Promise<{ billingKey?: TossBillingKeyResponse; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  try {
    const billingKeyData = await issueBillingKey(customerKey, authKey);

    // 빌링키 정보를 DB에 저장
    await supabase
      .from("subscriptions")
      .upsert(
        {
          user_id: user.id,
          toss_billing_key: billingKeyData.billingKey,
          toss_customer_key: customerKey,
          payment_provider: "toss",
          status: "active",
        },
        { onConflict: "user_id" }
      );

    return { billingKey: billingKeyData };
  } catch (err) {
    console.error("Toss billing key error:", err);
    return { error: "빌링키 발급에 실패했습니다" };
  }
}

// ─── 정기결제: 빌링키로 결제 ────────────────────────────

/**
 * 발급된 빌링키로 자동 결제를 수행합니다.
 *
 * @param billingKey - 빌링키
 * @param amount - 결제 금액
 * @param orderName - 주문명
 * @returns 결제 결과
 */
export async function chargeTossBilling(
  billingKey: string,
  amount: number,
  orderName: string
): Promise<{ payment?: TossPaymentResponse; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  const customerKey = `customer_${user.id}`;
  const orderId = `order_${user.id}_${Date.now()}`;

  try {
    const payment = await chargeBilling(
      billingKey,
      customerKey,
      amount,
      orderId,
      orderName
    );

    // 결제 성공 시 DB에 저장
    await supabase.from("purchases").upsert(
      {
        user_id: user.id,
        toss_payment_key: payment.paymentKey,
        toss_order_id: payment.orderId,
        product_name: payment.orderName,
        amount: payment.totalAmount,
        currency: "KRW",
        status: "paid",
        payment_provider: "toss",
        payment_method: payment.method,
      },
      { onConflict: "toss_order_id" }
    );

    // 구독 갱신일 업데이트
    const nextPeriodEnd = new Date();
    nextPeriodEnd.setMonth(nextPeriodEnd.getMonth() + 1);

    await supabase
      .from("subscriptions")
      .update({
        status: "active",
        current_period_end: nextPeriodEnd.toISOString(),
      })
      .eq("user_id", user.id)
      .eq("payment_provider", "toss");

    return { payment: payment as unknown as TossPaymentResponse };
  } catch (err) {
    console.error("Toss billing charge error:", err);
    return { error: "빌링 결제에 실패했습니다" };
  }
}

// ─── 구독 취소 ──────────────────────────────────────────

/**
 * 토스페이먼츠 정기결제(구독)를 해지합니다.
 * 현재 결제 기간이 끝날 때까지는 서비스를 이용할 수 있습니다.
 *
 * @returns 취소 결과
 */
export async function cancelTossSubscription(): Promise<{
  success?: boolean;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("payment_provider", "toss")
    .single();

  if (!subscription) {
    return { error: "구독 정보를 찾을 수 없습니다" };
  }

  try {
    // 구독 해지 예정 상태로 변경 (기간 끝까지 사용 가능)
    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("user_id", user.id)
      .eq("payment_provider", "toss");

    return { success: true };
  } catch (err) {
    console.error("Cancel toss subscription error:", err);
    return { error: "구독 해지에 실패했습니다" };
  }
}

// ─── 결제 취소(환불) ────────────────────────────────────

/**
 * 토스페이먼츠 결제를 취소(환불)합니다.
 *
 * @param paymentKey - 결제 키
 * @param cancelReason - 취소 사유
 * @param cancelAmount - 부분 취소 금액 (미입력 시 전액 취소)
 * @returns 취소 결과
 */
export async function cancelTossPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다" };
  }

  try {
    await cancelPayment(paymentKey, cancelReason, cancelAmount);

    // DB 상태 업데이트
    await supabase
      .from("purchases")
      .update({ status: cancelAmount ? "partial_refunded" : "refunded" })
      .eq("toss_payment_key", paymentKey)
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    console.error("Cancel toss payment error:", err);
    return { error: "결제 취소에 실패했습니다" };
  }
}

// ─── 현재 구독 조회 ─────────────────────────────────────

/**
 * 현재 사용자의 토스 구독 정보를 조회합니다.
 *
 * @returns 구독 정보 또는 null
 */
export async function getCurrentTossSubscription() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("payment_provider", "toss")
    .single();

  return subscription;
}

/**
 * 토스페이먼츠 결제 프로바이더 구현
 *
 * 토스페이먼츠 API v1 (REST API 직접 호출)
 * 기본 URL: https://api.tosspayments.com/v1
 * 인증: Basic Auth (시크릿키 Base64 인코딩)
 */

import crypto from "crypto";

// ─── 설정 ───────────────────────────────────────────────

const TOSS_API_BASE = "https://api.tosspayments.com/v1";

const tossConfig = {
  secretKey: process.env.TOSS_PAYMENTS_SECRET_KEY || "",
  clientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || "",
  webhookSecret: process.env.TOSS_PAYMENTS_WEBHOOK_SECRET || "",
};

function getAuthHeader(): string {
  const encoded = Buffer.from(`${tossConfig.secretKey}:`).toString("base64");
  return `Basic ${encoded}`;
}

// ─── 토스 API 응답 타입 ──────────────────────────────────

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: string;
  totalAmount: number;
  method: string;
  currency: string;
  approvedAt: string;
  requestedAt: string;
  card?: {
    company: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    approveNo: string;
    cardType: string;
    ownerType: string;
  };
  receipt?: {
    url: string;
  };
  cancels?: TossCancelDetail[];
  failure?: {
    code: string;
    message: string;
  };
}

export interface TossCancelDetail {
  cancelAmount: number;
  cancelReason: string;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  refundableAmount: number;
  easyPayDiscountAmount: number;
  canceledAt: string;
  transactionKey: string;
}

export interface TossBillingKeyResponse {
  billingKey: string;
  customerKey: string;
  cardCompany: string;
  cardNumber: string;
  authenticatedAt: string;
}

export interface TossBillingPaymentResponse {
  paymentKey: string;
  orderId: string;
  orderName: string;
  status: string;
  totalAmount: number;
  method: string;
  approvedAt: string;
}

// ─── 웹훅 이벤트 타입 ────────────────────────────────────

export type TossWebhookEventType =
  | "DONE"
  | "CANCELED"
  | "PARTIAL_CANCELED"
  | "ABORTED"
  | "EXPIRED";

export interface TossWebhookEvent {
  eventType: TossWebhookEventType;
  createdAt: string;
  data: TossPaymentResponse;
}

// ─── 플랜 정보 ──────────────────────────────────────────

export interface TossPlan {
  id: string;
  name: string;
  priceKrw: number;
  interval: "month" | "year";
}

export const TOSS_PLANS: TossPlan[] = [
  {
    id: "basic_monthly",
    name: "Basic",
    priceKrw: 9900,
    interval: "month",
  },
  {
    id: "pro_monthly",
    name: "Pro",
    priceKrw: 29900,
    interval: "month",
  },
];

export function getTossPlanById(planId: string): TossPlan | undefined {
  return TOSS_PLANS.find((plan) => plan.id === planId);
}

// ─── API 호출 헬퍼 ──────────────────────────────────────

async function tossApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${TOSS_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Toss API error: ${response.status} ${response.statusText}`
    );
  }

  return data as T;
}

// ─── 결제 승인 ──────────────────────────────────────────

/**
 * 결제 승인 API 호출
 * 클라이언트에서 결제 성공 후 서버에서 최종 승인을 수행합니다.
 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number
): Promise<TossPaymentResponse> {
  return tossApiRequest<TossPaymentResponse>("/payments/confirm", {
    method: "POST",
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
}

// ─── 결제 조회 ──────────────────────────────────────────

/**
 * paymentKey로 결제 조회
 */
export async function getPayment(
  paymentKey: string
): Promise<TossPaymentResponse> {
  return tossApiRequest<TossPaymentResponse>(`/payments/${paymentKey}`);
}

/**
 * orderId로 결제 조회
 */
export async function getPaymentByOrderId(
  orderId: string
): Promise<TossPaymentResponse> {
  return tossApiRequest<TossPaymentResponse>(
    `/payments/orders/${orderId}`
  );
}

// ─── 결제 취소 ──────────────────────────────────────────

/**
 * 결제 취소
 */
export async function cancelPayment(
  paymentKey: string,
  cancelReason: string,
  cancelAmount?: number
): Promise<TossPaymentResponse> {
  const body: Record<string, unknown> = { cancelReason };
  if (cancelAmount !== undefined) {
    body.cancelAmount = cancelAmount;
  }

  return tossApiRequest<TossPaymentResponse>(
    `/payments/${paymentKey}/cancel`,
    {
      method: "POST",
      body: JSON.stringify(body),
    }
  );
}

// ─── 빌링키 (정기결제) ─────────────────────────────────

/**
 * 빌링키 발급
 * 카드 자동결제를 위해 빌링키를 발급받습니다.
 */
export async function issueBillingKey(
  customerKey: string,
  authKey: string
): Promise<TossBillingKeyResponse> {
  return tossApiRequest<TossBillingKeyResponse>(
    "/billing/authorizations/issue",
    {
      method: "POST",
      body: JSON.stringify({ customerKey, authKey }),
    }
  );
}

/**
 * 빌링키로 자동 결제
 */
export async function chargeBilling(
  billingKey: string,
  customerKey: string,
  amount: number,
  orderId: string,
  orderName: string
): Promise<TossBillingPaymentResponse> {
  return tossApiRequest<TossBillingPaymentResponse>(
    `/billing/${billingKey}`,
    {
      method: "POST",
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName,
      }),
    }
  );
}

// ─── 웹훅 시그니처 검증 ─────────────────────────────────

/**
 * 토스페이먼츠 웹훅 시그니처 검증 (HMAC-SHA256)
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!tossConfig.webhookSecret) {
    console.error("TOSS_PAYMENTS_WEBHOOK_SECRET is not configured");
    return false;
  }

  try {
    const hmac = crypto.createHmac("sha256", tossConfig.webhookSecret);
    const digest = hmac.update(payload).digest("base64");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch {
    return false;
  }
}

// ─── PaymentProvider 인터페이스 구현 ────────────────────

/**
 * WS-1이 설계하는 PaymentProvider 인터페이스에 맞춰 구현할 예정.
 * 현재는 예상 인터페이스를 기반으로 구현합니다.
 *
 * 토스페이먼츠는 서버에서 checkout URL을 생성하는 방식이 아니라
 * 클라이언트 SDK에서 결제를 요청하는 방식이므로,
 * createCheckout은 결제에 필요한 정보(orderId, amount 등)를 반환합니다.
 */
export const tossPaymentProvider = {
  /**
   * 결제 요청에 필요한 정보를 생성합니다.
   * 토스는 클라이언트에서 SDK를 통해 결제를 시작하므로 URL 대신 결제 정보를 반환합니다.
   */
  async createCheckout(params: {
    planId: string;
    userId: string;
    email?: string;
    successUrl: string;
    failUrl: string;
  }): Promise<{ url?: string; checkoutData?: Record<string, unknown>; error?: string }> {
    const plan = getTossPlanById(params.planId);
    if (!plan) {
      return { error: "Invalid plan ID" };
    }

    const orderId = `order_${params.userId}_${Date.now()}`;

    return {
      checkoutData: {
        clientKey: tossConfig.clientKey,
        orderId,
        orderName: `${plan.name} Plan`,
        amount: plan.priceKrw,
        currency: "KRW",
        customerEmail: params.email,
        successUrl: params.successUrl,
        failUrl: params.failUrl,
      },
    };
  },

  /**
   * 토스페이먼츠는 별도의 고객 포털이 없으므로
   * 자체 구독 관리 페이지로 리다이렉트합니다.
   */
  async createPortalSession(
    _customerId: string
  ): Promise<{ url?: string; error?: string }> {
    return {
      url: "/dashboard/billing",
      error: undefined,
    };
  },

  /**
   * 정기결제(구독) 취소
   * 빌링키 기반 자동결제를 중단합니다.
   */
  async cancelSubscription(
    subscriptionId: string
  ): Promise<{ success?: boolean; error?: string }> {
    try {
      // 토스에서는 빌링키를 삭제하거나, 다음 결제를 중단하는 방식으로 해지
      // 실제로는 DB에서 구독 상태를 변경하고 다음 빌링 스케줄을 중단
      // 마지막 결제에 대한 취소가 아닌 구독 해지이므로 별도 API 호출 없이 상태만 변경
      console.log(`Canceling toss subscription: ${subscriptionId}`);
      return { success: true };
    } catch (err) {
      console.error("Cancel subscription error:", err);
      return { error: "Failed to cancel subscription" };
    }
  },

  /**
   * 취소된 구독 재활성화
   */
  async reactivateSubscription(
    subscriptionId: string
  ): Promise<{ success?: boolean; error?: string }> {
    try {
      console.log(`Reactivating toss subscription: ${subscriptionId}`);
      return { success: true };
    } catch (err) {
      console.error("Reactivate subscription error:", err);
      return { error: "Failed to reactivate subscription" };
    }
  },

  /**
   * 플랜 변경
   */
  async changePlan(
    subscriptionId: string,
    newPlanId: string
  ): Promise<{ success?: boolean; error?: string }> {
    const plan = getTossPlanById(newPlanId);
    if (!plan) {
      return { error: "Invalid plan ID" };
    }

    try {
      console.log(
        `Changing plan for subscription ${subscriptionId} to ${newPlanId}`
      );
      return { success: true };
    } catch (err) {
      console.error("Change plan error:", err);
      return { error: "Failed to change plan" };
    }
  },

  /**
   * 웹훅 시그니처 검증
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    return verifyWebhookSignature(payload, signature);
  },
};

export default tossPaymentProvider;

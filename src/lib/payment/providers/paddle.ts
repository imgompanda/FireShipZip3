/**
 * Paddle 결제 프로바이더
 *
 * Paddle Billing API v2 기반 구현.
 * @paddle/paddle-node-sdk 사용.
 * 체크아웃은 Paddle.js overlay checkout 방식.
 */

import crypto from "crypto";

import type {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutResult,
  PortalSessionResult,
  SubscriptionActionResult,
  WebhookVerificationResult,
} from "../types";

// Paddle 환경변수 설정
const paddleConfig = {
  apiKey: process.env.PADDLE_API_KEY || "",
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET || "",
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
  environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox") as
    | "sandbox"
    | "production",
};

// Paddle API 베이스 URL
function getApiBaseUrl(): string {
  return paddleConfig.environment === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";
}

// Paddle API 요청 헬퍼
async function paddleApiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: Record<string, unknown>;
  } = {}
): Promise<{ data?: T; error?: string }> {
  const { method = "GET", body } = options;
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${paddleConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Paddle API Error:", errorData);
      return { error: `Paddle API error: ${response.status}` };
    }

    const responseData = await response.json();
    return { data: responseData.data as T };
  } catch (err) {
    console.error("Paddle API Request Error:", err);
    return { error: "Paddle API request failed" };
  }
}

// Paddle 트랜잭션 응답 타입
interface PaddleTransaction {
  id: string;
  status: string;
  checkout?: {
    url?: string;
  };
}

// Paddle 구독 응답 타입
interface PaddleSubscription {
  id: string;
  status: string;
  management_urls?: {
    update_payment_method?: string;
    cancel?: string;
  };
  scheduled_change?: {
    action: string;
    effective_at: string;
  } | null;
}

export class PaddleProvider implements PaymentProvider {
  readonly type = "paddle" as const;

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    try {
      // Paddle에서는 Transaction을 생성하여 체크아웃 URL을 얻거나,
      // 클라이언트 사이드에서 Paddle.js를 사용하여 overlay checkout을 수행합니다.
      // 여기서는 Transaction 생성 방식을 사용합니다.
      // Paddle API는 Transaction 생성 시 inline customer 객체를 지원하지 않음.
      // customer_id가 있으면 포함하고, 없으면 draft 트랜잭션으로 생성하여
      // Paddle.js overlay checkout에서 고객 정보를 수집합니다.
      const transactionBody: Record<string, unknown> = {
        items: [
          {
            price_id: params.planId,
            quantity: 1,
          },
        ],
        custom_data: {
          user_id: params.userId,
          ...(params.metadata || {}),
        },
      };

      if (params.metadata?.paddle_customer_id) {
        transactionBody.customer_id = params.metadata.paddle_customer_id;
      }

      const result = await paddleApiRequest<PaddleTransaction>(
        "/transactions",
        {
          method: "POST",
          body: transactionBody,
        }
      );

      if (result.error) {
        return { error: result.error };
      }

      const transaction = result.data;

      // Paddle overlay checkout을 위해 트랜잭션 ID를 클라이언트 토큰으로 반환
      // 클라이언트에서 Paddle.Checkout.open({ transactionId }) 호출
      if (transaction?.id) {
        return {
          clientToken: transaction.id,
          url: transaction.checkout?.url,
        };
      }

      return { error: "Failed to create Paddle transaction" };
    } catch (err) {
      console.error("Paddle Checkout Error:", err);
      return { error: "Failed to create checkout" };
    }
  }

  async createPortalSession(
    customerId: string
  ): Promise<PortalSessionResult> {
    try {
      // Paddle에서는 구독의 management_urls를 통해 포털에 접근합니다.
      // customerId를 사용하여 해당 고객의 구독을 조회합니다.
      const result = await paddleApiRequest<PaddleSubscription[]>(
        `/subscriptions?customer_id=${customerId}&status=active`
      );

      if (result.error) {
        return { error: result.error };
      }

      const subscriptions = result.data;
      if (!subscriptions || subscriptions.length === 0) {
        return { error: "No active subscription found" };
      }

      const updateUrl =
        subscriptions[0].management_urls?.update_payment_method;
      if (!updateUrl) {
        return { error: "Portal URL not found" };
      }

      return { url: updateUrl };
    } catch (err) {
      console.error("Paddle Portal Error:", err);
      return { error: "Failed to get portal" };
    }
  }

  async cancelSubscription(
    subscriptionId: string
  ): Promise<SubscriptionActionResult> {
    try {
      const result = await paddleApiRequest<PaddleSubscription>(
        `/subscriptions/${subscriptionId}/cancel`,
        {
          method: "POST",
          body: {
            effective_from: "next_billing_period",
          },
        }
      );

      if (result.error) {
        return { error: result.error };
      }

      return { success: true };
    } catch (err) {
      console.error("Paddle Cancel Error:", err);
      return { error: "Failed to cancel subscription" };
    }
  }

  async reactivateSubscription(
    subscriptionId: string
  ): Promise<SubscriptionActionResult> {
    try {
      // Paddle에서 구독 재활성화: scheduled_change를 null로 설정
      const result = await paddleApiRequest<PaddleSubscription>(
        `/subscriptions/${subscriptionId}`,
        {
          method: "PATCH",
          body: {
            scheduled_change: null,
          },
        }
      );

      if (result.error) {
        return { error: result.error };
      }

      return { success: true };
    } catch (err) {
      console.error("Paddle Reactivate Error:", err);
      return { error: "Failed to reactivate subscription" };
    }
  }

  async changePlan(
    subscriptionId: string,
    newPlanId: string
  ): Promise<SubscriptionActionResult> {
    try {
      // Paddle에서 플랜 변경: 구독의 items를 업데이트
      const result = await paddleApiRequest<PaddleSubscription>(
        `/subscriptions/${subscriptionId}`,
        {
          method: "PATCH",
          body: {
            items: [
              {
                price_id: newPlanId,
                quantity: 1,
              },
            ],
            proration_billing_mode: "prorated_immediately",
          },
        }
      );

      if (result.error) {
        return { error: result.error };
      }

      return { success: true };
    } catch (err) {
      console.error("Paddle Change Plan Error:", err);
      return { error: "Failed to change plan" };
    }
  }

  verifyWebhookSignature(
    payload: string,
    signature: string
  ): WebhookVerificationResult {
    try {
      // Paddle Billing v2 웹훅 시그니처 검증
      // Paddle-Signature 헤더 형식: ts=timestamp;h1=hash
      const parts = signature.split(";");
      const tsStr = parts.find((p) => p.startsWith("ts="));
      const h1Str = parts.find((p) => p.startsWith("h1="));

      if (!tsStr || !h1Str) {
        return { valid: false, error: "Invalid signature format" };
      }

      const timestamp = tsStr.replace("ts=", "");
      const expectedHash = h1Str.replace("h1=", "");

      // 시그니처 생성: HMAC-SHA256(secret, timestamp:payload)
      const signedPayload = `${timestamp}:${payload}`;
      const hmac = crypto.createHmac("sha256", paddleConfig.webhookSecret);
      const computedHash = hmac.update(signedPayload).digest("hex");

      const valid = crypto.timingSafeEqual(
        Buffer.from(expectedHash),
        Buffer.from(computedHash)
      );

      return { valid };
    } catch (err) {
      console.error("Paddle Signature Verification Error:", err);
      return { valid: false, error: "Signature verification failed" };
    }
  }
}

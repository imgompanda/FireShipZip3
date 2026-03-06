/**
 * LemonSqueezy 결제 프로바이더
 *
 * 기존 src/services/lemon/actions.ts 및 src/lib/lemon/client.ts의 로직을
 * PaymentProvider 인터페이스에 맞게 래핑합니다.
 * 기존 파일은 수정하지 않습니다.
 */

import {
  createCheckout,
  updateSubscription,
  cancelSubscription as lemonCancelSubscription,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";
import { initLemonSqueezy, lemonConfig } from "@/lib/lemon/client";
import crypto from "crypto";

import type {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutResult,
  PortalSessionResult,
  SubscriptionActionResult,
  WebhookVerificationResult,
} from "../types";

export class LemonSqueezyProvider implements PaymentProvider {
  readonly type = "lemon" as const;

  constructor() {
    initLemonSqueezy();
  }

  async createCheckout(params: CreateCheckoutParams): Promise<CheckoutResult> {
    try {
      const { data, error } = await createCheckout(
        lemonConfig.storeId,
        params.planId,
        {
          checkoutData: {
            email: params.email,
            custom: {
              user_id: params.userId,
              ...(params.metadata || {}),
            },
          },
          productOptions: {
            redirectUrl: params.successUrl,
          },
        }
      );

      if (error) {
        console.error("LemonSqueezy Checkout Error:", error);
        return { error: "Failed to create checkout" };
      }

      const checkoutUrl = data?.data?.attributes?.url;
      if (!checkoutUrl) {
        return { error: "Checkout URL not found" };
      }

      return { url: checkoutUrl };
    } catch (err) {
      console.error("LemonSqueezy Checkout Error:", err);
      return { error: "Failed to create checkout" };
    }
  }

  async createPortalSession(
    customerId: string
  ): Promise<PortalSessionResult> {
    try {
      const { data } = await getCustomer(customerId);
      const portalUrl = data?.data?.attributes?.urls?.customer_portal;

      if (!portalUrl) {
        return { error: "Portal URL not found" };
      }

      return { url: portalUrl };
    } catch (err) {
      console.error("LemonSqueezy Portal Error:", err);
      return { error: "Failed to get portal" };
    }
  }

  async cancelSubscription(
    subscriptionId: string
  ): Promise<SubscriptionActionResult> {
    try {
      await lemonCancelSubscription(subscriptionId);
      return { success: true };
    } catch (err) {
      console.error("LemonSqueezy Cancel Error:", err);
      return { error: "Failed to cancel subscription" };
    }
  }

  async reactivateSubscription(
    subscriptionId: string
  ): Promise<SubscriptionActionResult> {
    try {
      await updateSubscription(subscriptionId, {
        cancelled: false,
      });
      return { success: true };
    } catch (err) {
      console.error("LemonSqueezy Reactivate Error:", err);
      return { error: "Failed to reactivate subscription" };
    }
  }

  async changePlan(
    subscriptionId: string,
    newPlanId: string
  ): Promise<SubscriptionActionResult> {
    try {
      await updateSubscription(subscriptionId, {
        variantId: parseInt(newPlanId),
      });
      return { success: true };
    } catch (err) {
      console.error("LemonSqueezy Change Plan Error:", err);
      return { error: "Failed to change plan" };
    }
  }

  verifyWebhookSignature(
    payload: string,
    signature: string
  ): WebhookVerificationResult {
    try {
      const hmac = crypto.createHmac("sha256", lemonConfig.webhookSecret);
      const digest = hmac.update(payload).digest("hex");
      const sigBuffer = Buffer.from(signature);
      const digestBuffer = Buffer.from(digest);
      if (sigBuffer.length !== digestBuffer.length) return { valid: false };
      const valid = crypto.timingSafeEqual(sigBuffer, digestBuffer);
      return { valid };
    } catch (err) {
      console.error("LemonSqueezy Signature Verification Error:", err);
      return { valid: false, error: "Signature verification failed" };
    }
  }
}

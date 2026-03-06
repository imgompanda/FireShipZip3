import { trackCustom } from "@/lib/analytics/tracker";

export type PaymentProviderType = "lemon" | "paddle" | "toss";

/**
 * Payment-specific event tracker.
 * Wraps the existing analytics tracker to send payment events
 * with structured metadata.
 */
export const paymentTracker = {
  /**
   * Track when a user selects a payment provider.
   */
  providerSelected(provider: PaymentProviderType, plan: string) {
    trackCustom("payment_provider_selected", { provider, plan });
  },

  /**
   * Track when a checkout is initiated.
   */
  checkoutInitiated(
    provider: PaymentProviderType,
    plan: string,
    amount: number
  ) {
    trackCustom("checkout_initiated", { provider, plan, amount });
  },

  /**
   * Track when a checkout completes successfully.
   */
  checkoutCompleted(
    provider: PaymentProviderType,
    plan: string,
    amount: number,
    orderId: string
  ) {
    trackCustom("checkout_completed", { provider, plan, amount, orderId });
  },

  /**
   * Track when a checkout fails.
   */
  checkoutFailed(
    provider: PaymentProviderType,
    plan: string,
    error: string
  ) {
    trackCustom("checkout_failed", { provider, plan, error });
  },

  /**
   * Track when a subscription is canceled.
   */
  subscriptionCanceled(provider: PaymentProviderType, plan: string) {
    trackCustom("subscription_canceled", { provider, plan });
  },

  /**
   * Track when a subscription is reactivated.
   */
  subscriptionReactivated(provider: PaymentProviderType, plan: string) {
    trackCustom("subscription_reactivated", { provider, plan });
  },

  /**
   * Track when a user changes their plan.
   */
  planChanged(
    provider: PaymentProviderType,
    oldPlan: string,
    newPlan: string
  ) {
    trackCustom("plan_changed", { provider, oldPlan, newPlan });
  },
};

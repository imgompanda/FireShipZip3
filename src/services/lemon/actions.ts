"use server";

import {
  createCheckout,
  updateSubscription,
  cancelSubscription as lemonCancelSubscription,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";
import { initLemonSqueezy, lemonConfig } from "@/lib/lemon/client";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Creates a checkout URL for Lemon Squeezy Overlay checkout.
 *
 * @param {string} variantId - The ID of the product variant to purchase.
 * @returns {Promise<{ url?: string; error?: string }>} The checkout URL or an error message.
 *
 * @example
 * const { url, error } = await getCheckoutUrl("123456");
 * if (url) {
 *   // Open overlay
 * }
 */
export async function getCheckoutUrl(variantId: string) {
  initLemonSqueezy();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in to subscribe" };
  }

  const origin = (await headers()).get("origin");

  try {
    const { data, error } = await createCheckout(
      lemonConfig.storeId,
      variantId,
      {
        checkoutData: {
          email: user.email,
          custom: {
            user_id: user.id,
          },
        },
        productOptions: {
          redirectUrl: `${origin}/dashboard?success=true`,
        },
      }
    );

    if (error) {
      console.error("Checkout Error:", error);
      return { error: "Failed to create checkout" };
    }

    const checkoutUrl = data?.data?.attributes?.url;
    if (!checkoutUrl) {
      return { error: "Checkout URL not found" };
    }

    return { url: checkoutUrl };
  } catch (err) {
    console.error("Checkout Error:", err);
    return { error: "Failed to create checkout" };
  }
}

/**
 * Creates a checkout session and redirects the user to the Lemon Squeezy hosted checkout page.
 *
 * @param {string} variantId - The ID of the product variant to purchase.
 * @returns {Promise<{ error?: string } | void>} Redirects on success, or returns an error object.
 */
export async function createCheckoutSession(variantId: string) {
  initLemonSqueezy();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in to subscribe" };
  }

  const origin = (await headers()).get("origin");

  try {
    const { data } = await createCheckout(lemonConfig.storeId, variantId, {
      checkoutData: {
        email: user.email,
        custom: {
          user_id: user.id,
        },
      },
      productOptions: {
        redirectUrl: `${origin}/dashboard?success=true`,
      },
    });

    const checkoutUrl = data?.data?.attributes?.url;
    if (!checkoutUrl) {
      return { error: "Checkout URL not found" };
    }

    // redirect() throws an error internally, so it must be outside the try-catch block for Next.js to handle it
    redirect(checkoutUrl);
  } catch (err) {
    if ((err as Error).message === "NEXT_REDIRECT") throw err;
    console.error("Checkout Error:", err);
    return { error: "Failed to create checkout" };
  }

  return { error: "Checkout URL not found" };
}

/**
 * Generates a URL for the Lemon Squeezy Customer Portal where users can manage their subscription.
 *
 * @returns {Promise<{ url?: string; error?: string }>} The portal URL or an error message.
 */
export async function createPortalSession() {
  initLemonSqueezy();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in to manage billing" };
  }

  // Get user's LemonSqueezy Customer ID
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("lemon_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.lemon_customer_id) {
    return { error: "No subscription found" };
  }

  try {
    const { data } = await getCustomer(subscription.lemon_customer_id);
    const portalUrl = data?.data?.attributes?.urls?.customer_portal;
    if (!portalUrl) {
      return { error: "Portal URL not found" };
    }

    // Return URL (redirect on client)
    return { url: portalUrl };
  } catch (err) {
    console.error("Portal Error:", err);
    return { error: "Failed to get portal" };
  }
}

/**
 * Cancels the user's active subscription.
 * The subscription will remain active until the end of the current billing period.
 *
 * @returns {Promise<{ success?: boolean; error?: string }>} Result status.
 */
export async function cancelSubscription() {
  initLemonSqueezy();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in" };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("lemon_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.lemon_subscription_id) {
    return { error: "No subscription found" };
  }

  try {
    await lemonCancelSubscription(subscription.lemon_subscription_id);

    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    console.error("Cancel Error:", err);
    return { error: "Failed to cancel subscription" };
  }
}

/**
 * Reactivates a canceled subscription that hasn't expired yet (grace period).
 *
 * @returns {Promise<{ success?: boolean; error?: string }>} Result status.
 */
export async function reactivateSubscription() {
  initLemonSqueezy();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in" };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("lemon_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.lemon_subscription_id) {
    return { error: "No subscription found" };
  }

  try {
    await updateSubscription(subscription.lemon_subscription_id, {
      cancelled: false,
    });

    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: false })
      .eq("user_id", user.id);

    return { success: true };
  } catch (err) {
    console.error("Reactivate Error:", err);
    return { error: "Failed to reactivate subscription" };
  }
}

/**
 * Upgrades or downgrades the user's subscription plan.
 *
 * @param {string} newVariantId - The new product variant ID to switch to.
 * @returns {Promise<{ success?: boolean; error?: string }>} Result status.
 */
export async function changePlan(newVariantId: string) {
  initLemonSqueezy();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please log in" };
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("lemon_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.lemon_subscription_id) {
    return { error: "No subscription found" };
  }

  try {
    await updateSubscription(subscription.lemon_subscription_id, {
      variantId: parseInt(newVariantId),
    });

    return { success: true };
  } catch (err) {
    console.error("Change Plan Error:", err);
    return { error: "Failed to change plan" };
  }
}

/**
 * Generates a Customer Portal URL specifically for updating payment methods.
 * This is a wrapper around `createPortalSession`.
 *
 * @returns {Promise<{ url?: string; error?: string }>} The portal URL.
 */
export async function updatePaymentMethod() {
  return createPortalSession();
}

/**
 * Retrieves the current user's subscription details from the database.
 *
 * @returns {Promise<any | null>} The subscription object or null if not found/logged out.
 */
export async function getCurrentSubscription() {
  initLemonSqueezy();

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
    .single();

  return subscription;
}

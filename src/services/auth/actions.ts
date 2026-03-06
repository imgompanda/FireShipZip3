"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

/**
 * Initiates the Google OAuth flow.
 * It redirects the user to Google's login page.
 */
export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google Login Error:", error);
    // In a real app, you might return an error state
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * Sends a Magic Link (passwordless login) to the user's email.
 */
export async function loginWithMagicLink(email: string) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Allows the user to be redirected to the dashboard after clicking the link
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Magic Link Error:", error);
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Signs out the current user and redirects to the home page.
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear demo cookie if exists
  const cookieStore = await cookies();
  cookieStore.delete("demo_mode");

  redirect("/");
}

/**
 * Enables Demo Mode for previewing the dashboard without login.
 */
export async function enableDemoMode() {
  if (process.env.NEXT_PUBLIC_ENABLE_DEMO !== "true") {
    return { error: "Demo mode is disabled" };
  }
  const cookieStore = await cookies();
  cookieStore.set("demo_mode", "true", { path: "/" });
  redirect("/dashboard");
}

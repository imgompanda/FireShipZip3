"use server";

import { resend } from "@/lib/resend/client";
import WelcomeEmail from "@/components/emails/WelcomeEmail";

interface SendWelcomeEmailParams {
  email: string;
  userName: string;
  planName?: string;
  locale?: "en" | "ko";
}

export async function sendWelcomeEmail({
  email,
  userName,
  planName = "Basic",
  locale = "en",
}: SendWelcomeEmailParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const dashboardUrl = `${baseUrl}/${locale}/dashboard`;

  // 제목 다국어 처리
  const subjects = {
    en: "Welcome to Global SaaS! 🎉",
    ko: "Global SaaS에 오신 것을 환영해요! 🎉",
  };

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@resend.dev",
      to: [email],
      subject: subjects[locale],
      react: WelcomeEmail({
        userName,
        planName,
        dashboardUrl,
        locale,
      }),
    });

    if (error) {
      console.error("Resend Error:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email Sending Failed:", error);
    return { error: "Failed to send email" };
  }
}

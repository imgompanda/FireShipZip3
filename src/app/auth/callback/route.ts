import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { routing } from "@/i18n/routing";
import { sendWelcomeEmail } from "@/services/email/actions";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Get preferred locale from cookie or default
  const cookieStore = request.headers.get("cookie");
  const localeCookie = cookieStore
    ?.split("; ")
    .find((c) => c.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];
  const locale = (localeCookie || routing.defaultLocale) as "en" | "ko";

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard";

  // Ensure the redirect path is localized
  const localizedNext = `/${locale}${next.startsWith("/") ? next : `/${next}`}`;

  // Magic Link는 code 파라미터를 사용
  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    // 디버깅용 에러 로깅
    if (error) {
      console.error("Auth code exchange error:", error.message, error);
    }

    if (!error && data?.user) {
      const user = data.user;

      // 신규 사용자 감지: created_at이 10초 이내면 신규
      const createdAt = new Date(user.created_at);
      const now = new Date();
      const isNewUser = now.getTime() - createdAt.getTime() < 10000; // 10초

      // 신규 사용자에게 환영 이메일 발송 (비동기 - 리다이렉트 지연 방지)
      if (isNewUser) {
        const userName =
          user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

        // 비동기로 이메일 발송 (응답 대기하지 않음)
        sendWelcomeEmail({
          email: user.email!,
          userName,
          locale,
        }).catch((err) => console.error("Welcome email failed:", err));
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      const baseUrl = isLocalEnv
        ? origin
        : forwardedHost
          ? `https://${forwardedHost}`
          : origin;

      return NextResponse.redirect(`${baseUrl}${localizedNext}`);
    }
  } else {
    console.error(
      "Auth callback: No code parameter received. URL:",
      request.url
    );
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(
    `${origin}/${locale}/login?error=auth-code-error`
  );
}

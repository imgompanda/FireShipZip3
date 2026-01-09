import { updateSession } from "@/utils/supabase/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Run next-intl middleware to handle locale redirects and get the base response
  const response = intlMiddleware(request);

  // 2. Run Supabase session update (copies cookies to response)
  const supabaseResponse = await updateSession(request, response);

  // 3. Simple Route Protection (Mockup logic, real protection involves checking session in updateSession or here)
  // For strict middleware protection, we usually check supabase.auth.getUser() inside updateSession and redirect if needed.
  // However, updating session in middleware is mainly for cookie refreshing.
  // We will rely on layout/page level checks (like in dashboard/page.tsx) or RLS for data.
  // But if we want to redirect unauthenticated users away from /dashboard immediately:
  // (Adding this logic requires reading the hook response or doing a check here)

  return supabaseResponse;
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - auth routes (handled by root route handlers)
  // - _next (static files)
  // - _vercel (Vercel internals)
  // - Static files (e.g. favicon.ico, sitemap.xml, robots.txt, etc.)
  matcher: ["/((?!api|auth|_next|_vercel|.*\\..*).*)"],
};

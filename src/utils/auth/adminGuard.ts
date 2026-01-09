"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

/**
 * Admin 권한 확인 유틸리티
 * API Routes나 Server Actions에서 Admin 권한을 검증할 때 사용
 *
 * @throws {Error} 인증되지 않거나 Admin 권한이 없는 경우
 * @returns {Promise<{ id: string; email: string }>} Admin 사용자 정보
 *
 * @example
 * // Server Action에서 사용
 * export async function adminOnlyAction() {
 *   const admin = await requireAdmin();
 *   // admin 권한이 필요한 로직
 * }
 *
 * @example
 * // API Route에서 사용
 * export async function GET() {
 *   const admin = await requireAdmin();
 *   // admin 권한이 필요한 로직
 * }
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    throw new Error("Unauthorized: Not logged in");
  }

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  if (!adminEmails.includes(user.email)) {
    throw new Error("Forbidden: Admin access required");
  }

  return { id: user.id, email: user.email };
}

/**
 * Admin 권한 확인 (리다이렉트 버전)
 * Layout이나 Page에서 Admin이 아니면 리다이렉트할 때 사용
 *
 * @param {string} redirectTo - 권한 없을 시 리다이렉트할 경로 (기본: /dashboard)
 * @returns {Promise<{ id: string; email: string }>} Admin 사용자 정보
 */
export async function requireAdminOrRedirect(
  redirectTo: string = "/dashboard"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect("/login");
  }

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  if (!adminEmails.includes(user.email)) {
    redirect(redirectTo);
  }

  return { id: user.id, email: user.email };
}

/**
 * Admin 여부만 확인 (에러 없이)
 * 조건부 렌더링에 사용
 *
 * @returns {Promise<boolean>} Admin 여부
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) return false;

    const adminEmails =
      process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
    return adminEmails.includes(user.email);
  } catch {
    return false;
  }
}

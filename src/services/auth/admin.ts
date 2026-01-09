"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * 현재 사용자가 어드민인지 확인합니다.
 * 이메일을 직접 전달하면 추가적인 getUser 호출을 건너뜁니다.
 */
export async function checkIsAdmin(email?: string | null): Promise<boolean> {
  let userEmail = email;

  if (!userEmail) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email;
  }

  if (!userEmail) {
    return false;
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(userEmail);
}

import { AILayout } from "@/components/ai";
import { DashboardSidebar } from "@/components/features/dashboard/DashboardSidebar";
import { checkIsAdmin } from "@/services/auth/admin";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function AIPage() {
  const videoEnabled = !!process.env.FAL_API_KEY;
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  let isAdmin = false;

  if (isDemoMode) {
    isAdmin = true;
  } else {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const { redirect } = await import("next/navigation");
      return redirect("/login");
    }

    isAdmin = await checkIsAdmin(user.email);
  }

  const t = await getTranslations("AI");

  return (
    <DashboardSidebar isAdmin={isAdmin}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">{t("title")}</h1>
          <p className="text-base-content/60 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <AILayout videoEnabled={videoEnabled} />
      </div>
    </DashboardSidebar>
  );
}

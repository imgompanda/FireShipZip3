import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isDemoMode = process.env.NEXT_PUBLIC_ENABLE_DEMO === "true" && cookieStore.get("demo_mode")?.value === "true";
  const t = await getTranslations("Admin");

  // Bypass auth for demo mode
  if (!isDemoMode) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email === undefined || user.email === null) {
      const { redirect } = await import("next/navigation");
      redirect("/login");
      return null;
    }

    const userEmail: string = user.email;
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];

    if (!adminEmails.includes(userEmail)) {
      const { redirect } = await import("next/navigation");
      redirect("/dashboard");
      return null;
    }
  }

  return (
    <div className="w-full min-h-screen bg-base-100 pb-12">
      <div className="container mx-auto p-6 md:p-8 max-w-7xl space-y-6">
        {/* Admin Navigation Tabs */}
        <AdminNav
          links={[
            { href: "/admin/analytics", label: t("analytics.title") },
            { href: "/admin/overview", label: t("overview.title") },
            { href: "/admin/customers", label: t("customers.title") },
            { href: "/admin/sales", label: t("sales.title") },
            { href: "/admin/tickets", label: t("tickets.title") },
            { href: "/admin/chatbot", label: t("chatbot.title") },
            { href: "/admin/knowledge", label: t("knowledge.title") },
            { href: "/admin/webhooks", label: t("webhooks.title") },
          ]}
          backLabel={t("backToDashboard")}
        />

        {isDemoMode && (
          <div className="bg-warning/10 text-warning px-4 py-2 rounded-md text-sm mb-4">
            ⚠️ You are viewing the Admin Console in <strong>Demo Mode</strong>.
            Data is mocked and actions are disabled.
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

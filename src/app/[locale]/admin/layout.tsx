import { createClient } from "@/utils/supabase/server";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";
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
    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

    if (!adminEmails.includes(userEmail)) {
      const { redirect } = await import("next/navigation");
      redirect("/dashboard");
      return null;
    }
  }

  return (
    <div className="w-full min-h-fit bg-zinc-50 dark:bg-zinc-950 pb-12">
      <div className="container mx-auto p-6 md:p-8 max-w-7xl space-y-6">
        {/* Admin Navigation Tabs */}
        <nav className="flex gap-4 border-b pb-4 overflow-x-auto">
          <Link
            href="/admin/overview"
            className="text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            {t("overview.title")}
          </Link>
          <Link
            href="/admin/customers"
            className="text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            {t("customers.title")}
          </Link>
          <Link
            href="/admin/webhooks"
            className="text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            {t("webhooks.title")}
          </Link>
          <Link
            href="/admin/sales"
            className="text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            {t("sales.title")}
          </Link>
          <Link
            href="/admin/tickets"
            className="text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            {t("tickets.title")}
          </Link>
          <Link
            href="/dashboard"
            className="ml-auto text-sm font-medium px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500 whitespace-nowrap"
          >
            {t("backToDashboard")}
          </Link>
          <div className="flex items-center pl-2 border-l ml-2">
            <ThemeToggle />
          </div>
        </nav>

        {isDemoMode && (
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-md text-sm mb-4">
            ⚠️ You are viewing the Admin Console in <strong>Demo Mode</strong>.
            Data is mocked and actions are disabled.
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

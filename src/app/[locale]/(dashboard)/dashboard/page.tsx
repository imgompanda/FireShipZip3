import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/navigation"; // Disabled for Demo Mode
import { DashboardSidebar } from "@/components/features/dashboard/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Sparkles, Activity, Users } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { checkIsAdmin } from "@/services/auth/admin";
import { ScrollAnimation } from "@/components/ui/animated/ScrollAnimation";

import { cookies } from "next/headers";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  const cookieStore = await cookies();
  const isDemo = cookieStore.get("demo_mode")?.value === "true";

  let user = null;
  let subscription = null;
  let isAdmin = false;

  if (isDemo) {
    user = { id: "demo-user", email: "demo@fireship.io" };
    subscription = {
      plan_name: "Pro Plan (Demo)",
      status: "active",
      current_period_end: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };
    isAdmin = true;
  } else {
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      const { redirect } = await import("next/navigation");
      return redirect("/login");
    }

    user = supabaseUser;

    // Real User Subscription
    const { data: subData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    subscription = subData;
    // Admin 여부 확인
    isAdmin = await checkIsAdmin(user.email);
  }

  return (
    <DashboardSidebar isAdmin={isAdmin}>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <ScrollAnimation animation="slide-up" duration={0.6}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-base-content to-base-content/60 bg-clip-text text-transparent">
                {t("title")}
              </h1>
              <p className="text-base-content/70 mt-1 text-lg">
                {t("welcome", { name: user?.email?.split("@")[0] || "User" })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="hidden sm:flex rounded-xl shadow-md">
                <Sparkles className="mr-2 h-4 w-4" />
                {t("cards.quickAction")}
              </Button>
            </div>
          </div>
        </ScrollAnimation>

        <Separator className="my-6 bg-gradient-to-r from-transparent via-base-300 to-transparent" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Subscription Summary Card */}
          <ScrollAnimation animation="slide-up" delay={0.1}>
            <Card className="h-full group hover:shadow-xl transition-all duration-500 border-base-300 hover:border-info/20 relative overflow-hidden bg-base-100/50 backdrop-blur-sm">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CreditCard className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-base-content/70">
                  {t("cards.subscription.title")}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-info/10 flex items-center justify-center text-info shadow-sm">
                  <CreditCard className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 tracking-tight">
                  {subscription?.plan_name || "Free Plan"}
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <Badge
                    variant={
                      subscription?.status === "active"
                        ? "default"
                        : "secondary"
                    }
                    className="text-[10px] px-2 py-0.5 h-5 font-semibold"
                  >
                    {subscription?.status === "active"
                      ? t("cards.subscription.active")
                      : t("cards.subscription.inactive")}
                  </Badge>
                  {subscription?.current_period_end && (
                    <span
                      className="text-xs text-base-content/50"
                      suppressHydrationWarning
                    >
                      {t("cards.subscription.renews", {
                        date: new Date(
                          subscription.current_period_end
                        ).toLocaleDateString(),
                      })}
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full relative z-10 hover:bg-info/10 hover:text-info hover:border-info/30 transition-all rounded-lg"
                  asChild
                >
                  <Link href="/subscription">
                    {t("cards.subscription.manage")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* 2. Usage / Activity Chart */}
          <ScrollAnimation animation="slide-up" delay={0.2}>
            <Card className="h-full group hover:shadow-xl transition-all duration-500 border-base-300 bg-base-100/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-base-content/70">
                  {t("cards.usage.title")}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-success shadow-sm">
                  <Activity className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 tracking-tight">
                  0{" "}
                  <span className="text-sm font-normal text-base-content/50">
                    {t("cards.reqs")}
                  </span>
                </div>
                <p className="text-xs text-base-content/50 font-medium mb-4 flex items-center">
                  {t("cards.connectDatabase")}
                </p>

                {/* CSS Bar Chart Visualization */}
                <div className="flex items-end gap-2 h-16 pt-2">
                  {[40, 60, 45, 70, 50, 80, 65].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-base-200 rounded-t-sm hover:bg-success/80 transition-colors relative group/bar"
                      style={{ height: `${height}%` }}
                    >
                      {/* Tooltip on hover (simple) */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap hidden sm:block pointer-events-none">
                        {height * 10} reqs
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* 3. Team / Project Placeholder */}
          <ScrollAnimation animation="slide-up" delay={0.3}>
            <Card className="h-full group hover:shadow-xl transition-all duration-500 border-base-300 bg-base-100/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-base-content/70">
                  {t("cards.projects.title")}
                </CardTitle>
                <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center text-warning shadow-sm">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1 tracking-tight">
                  0{" "}
                  <span className="text-sm font-normal text-base-content/50">
                    {t("cards.active")}
                  </span>
                </div>
                <p className="text-xs text-base-content/50 mb-6 font-normal">
                  {t("cards.noProjects")}
                </p>
                <div className="flex -space-x-2 overflow-hidden mb-4">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-base-100 bg-base-200 flex items-center justify-center text-[10px] text-base-content/50">
                    +
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-base-content/50 hover:text-base-content hover:bg-base-200 rounded-lg"
                  disabled
                >
                  {t("cards.projects.button")} →
                </Button>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>

        {/* Feature Section Placeholder */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <ScrollAnimation animation="slide-up" delay={0.4}>
            <Card className="h-full col-span-1 border-base-300 bg-base-100/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-lg">
                  {t("cards.activity.title")}
                </CardTitle>
                <CardDescription>
                  {t("cards.activity.description")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32 text-sm text-base-content/50 border border-dashed border-base-300 rounded-lg bg-base-200/50">
                  {t("cards.activity.noData") || "No recent activity found."}
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          {/* Quick Actions / Tips */}
          <ScrollAnimation animation="slide-up" delay={0.5}>
            <Card className="h-full col-span-1 border-dashed bg-base-200/50 border-base-300 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  {t("cards.customize.title")}
                </CardTitle>
                <CardDescription>
                  {t("cards.customize.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-base-content/70 space-y-3 bg-base-100 p-5 rounded-xl border border-base-300 shadow-sm">
                  <p>
                    {t.rich("cards.customize.tips.one", {
                      strong: (chunks) => (
                        <strong className="text-base-content">
                          {chunks}
                        </strong>
                      ),
                    })}
                  </p>
                  <Separator className="bg-base-300" />
                  <p>
                    {t.rich("cards.customize.tips.two", {
                      strong: (chunks) => (
                        <strong className="text-base-content">
                          {chunks}
                        </strong>
                      ),
                    })}
                  </p>
                  <Separator className="bg-base-300" />
                  <p>
                    {t.rich("cards.customize.tips.three", {
                      strong: (chunks) => (
                        <strong className="text-base-content">
                          {chunks}
                        </strong>
                      ),
                      code: (chunks) => (
                        <code className="bg-base-200 px-1.5 py-0.5 rounded text-xs font-mono text-error border border-base-300">
                          {chunks}
                        </code>
                      ),
                    })}
                  </p>
                </div>
                <Button size="sm" asChild className="w-full rounded-xl">
                  <Link href="/settings">{t("cards.customize.button")}</Link>
                </Button>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </DashboardSidebar>
  );
}

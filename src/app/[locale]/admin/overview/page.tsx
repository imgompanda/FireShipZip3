import { createAdminClient } from "@/utils/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, TrendingDown } from "lucide-react";
import { AdminChart } from "@/components/admin/AdminChart";
import { getTranslations } from "next-intl/server";
import { getPlanByVariantId } from "@/lib/lemon/plans";

async function getAdminStats() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  if (isDemoMode) {
    return {
      activeCount: 128,
      mrr: 5400,
      salesToday: 12,
      chartData: [
        { name: "Jan", mrr: 2000 },
        { name: "Feb", mrr: 3500 },
        { name: "Mar", mrr: 4200 },
        { name: "Apr", mrr: 5400 },
      ],
      recentSubs: [
        {
          id: "demo-1",
          status: "active",
          updated_at: new Date().toISOString(),
          plan_name: "Pro Plan",
          user_id: "user_demo_01",
        },
        {
          id: "demo-2",
          status: "active",
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          plan_name: "Starter Plan",
          user_id: "user_demo_02",
        },
        {
          id: "demo-3",
          status: "canceled",
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          plan_name: "Pro Plan",
          user_id: "user_demo_03",
        },
      ],
    };
  }

  // Admin Client 사용 (RLS 우회)
  const supabase = createAdminClient();

  // 활성 구독자 수와 plan_id 조회
  const { data: activeSubscriptions } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("status", "active");

  const activeCount = activeSubscriptions?.length || 0;

  // MRR 계산 (plan_id 기반 가격 합산)
  let mrr = 0;
  activeSubscriptions?.forEach((sub) => {
    const plan = getPlanByVariantId(sub.plan_id);
    // "$29/month" → 29 추출
    const priceMatch = plan.price.match(/\$(\d+)/);
    mrr += priceMatch ? parseInt(priceMatch[1]) : 0;
  });

  // 오늘 판매량 (최근 24시간 내 생성된 구독)
  const twentyFourHoursAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();
  const { count: salesToday } = await supabase
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", twentyFourHoursAgo);

  // 최근 구독 내역 (최신 5건)
  const { data: recentSubs } = await supabase
    .from("subscriptions")
    .select(
      `
      id,
      status,
      updated_at,
      plan_name,
      user_id
    `
    )
    .order("updated_at", { ascending: false })
    .limit(5);

  // 월별 성장 데이터
  // 실제 서비스에서는 월별 MRR 스냅샷을 별도 테이블에 저장하는 것이 좋음
  // 현재는 이번 달 MRR만 표시
  const currentMonth = new Date().toLocaleString("en", { month: "short" });
  const chartData = mrr > 0 ? [{ name: currentMonth, mrr }] : [];

  return {
    activeCount: activeCount || 0,
    mrr,
    recentSubs: recentSubs || [],
    salesToday: salesToday || 0,
    chartData,
  };
}

interface Subscription {
  id: string;
  status: string;
  updated_at: string;
  plan_name: string;
  user_id: string;
}

import { ScrollAnimation } from "@/components/ui/animated/ScrollAnimation";

export default async function AdminOverviewPage() {
  const { activeCount, mrr, recentSubs, salesToday, chartData } =
    await getAdminStats();
  const t = await getTranslations("Admin.overview");

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <ScrollAnimation animation="fade-in">
        <h1 className="text-3xl font-bold tracking-tight text-base-content">
          {t("title")}
        </h1>
      </ScrollAnimation>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: t("mrr"),
            icon: DollarSign,
            value: `$${mrr.toLocaleString()}`,
            desc: t("mrrChange"),
            delay: 0.1,
          },
          {
            title: t("activeSubscribers"),
            icon: Users,
            value: activeCount,
            desc: t("subscribersChange"),
            delay: 0.2,
          },
          {
            title: t("salesToday"),
            icon: CreditCard,
            value: `+${salesToday}`,
            desc: t("salesChange"),
            delay: 0.3,
          },
          {
            title: t("churnRate"),
            icon: TrendingDown,
            value: "-%",
            desc: t("churnChange"),
            delay: 0.4,
          },
        ].map((item, idx) => (
          <ScrollAnimation key={idx} animation="slide-up" delay={item.delay}>
            <Card className="hover:shadow-lg transition-shadow duration-300 border-base-300 bg-base-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-base-content/70">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-base-content/50" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-base-content">
                  {item.value}
                </div>
                <p className="text-xs text-base-content/50">{item.desc}</p>
              </CardContent>
            </Card>
          </ScrollAnimation>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ScrollAnimation animation="slide-up" delay={0.5}>
            {/* 래퍼나 추가 스타일링을 위해 div로 감쌈 */}
            <div className="rounded-xl border border-base-300 bg-base-100 p-1 shadow-sm hover:shadow-md transition-shadow">
              <AdminChart data={chartData} />
            </div>
          </ScrollAnimation>
        </div>
        <Card className="col-span-3 border-base-300 bg-base-100 shadow-sm">
          <ScrollAnimation animation="slide-up" delay={0.6}>
            <CardHeader>
              <CardTitle className="text-base-content">
                {t("recentSubscriptions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {recentSubs?.map((sub: Subscription) => (
                  <div key={sub.id} className="flex items-center group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-base-200 border border-base-300">
                      <Users className="h-4 w-4 text-base-content/50" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-base-content group-hover:text-primary transition-colors">
                        {sub.user_id.substring(0, 8)}...
                      </p>
                      <p className="text-xs text-base-content/50">
                        {sub.plan_name} • {sub.status}
                      </p>
                    </div>
                    <div className="ml-auto flex flex-col items-end">
                      <span className="font-medium text-sm text-base-content">
                        {sub.status === "active" ? "+$19.00" : "$0.00"}
                      </span>
                      <span className="text-[10px] text-base-content/50">
                        {new Date(sub.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {!recentSubs?.length && (
                  <p className="text-sm text-base-content/50 py-4 text-center">
                    {t("noSubscriptions")}
                  </p>
                )}
              </div>
            </CardContent>
          </ScrollAnimation>
        </Card>
      </div>
    </div>
  );
}

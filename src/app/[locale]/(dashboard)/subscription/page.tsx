import { createClient } from "@/utils/supabase/server";
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
import { Link } from "@/i18n/routing";
import { CheckIcon } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Separator } from "@/components/ui/separator";
import { ManageBillingButton } from "@/components/features/subscription/ManageBillingButton";
import { CancelSubscriptionButton } from "@/components/features/subscription/CancelSubscriptionButton";
import { getPlanByVariantId, FREE_PLAN } from "@/lib/lemon/plans";
import { checkIsAdmin } from "@/services/auth/admin";
import { cookies } from "next/headers";

interface Purchase {
  created_at: string;
  product_name: string;
  variant_name?: string;
  amount: number;
  currency: string;
  status: string;
  receipt_url?: string;
}

export default async function SubscriptionPage() {
  const t = await getTranslations("Subscription");
  const locale = await getLocale();
  const cookieStore = await cookies();
  const isDemoMode = cookieStore.get("demo_mode")?.value === "true";

  let user: any = null;
  let subscription: any = null;
  let purchasesData: any[] | null = null;
  let supabase = null;

  if (isDemoMode) {
    user = {
      id: "demo-user",
      email: "demo@example.com",
    };
    // Mock Subscription for Demo
    subscription = {
      plan_id: 1, // Assume Pro Plan
      status: "active",
      current_period_end: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
      cancel_at_period_end: false,
      created_at: new Date().toISOString(),
    };
    purchasesData = [];
  } else {
    supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!user) {
      const { redirect } = await import("next/navigation");
      return redirect("/login");
    }

    // 실제 구독 정보 가져오기
    const subscriptionResult = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    subscription = subscriptionResult.data;

    // 일회성 결제 내역 가져오기
    const purchasesResult = await supabase
      .from("purchases")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    purchasesData = purchasesResult.data;
  }

  const hasActiveSubscription = subscription?.status === "active";

  // variant_id 기반으로 플랜 정보 가져오기
  // Demo mode: mock plan_id or default to free if undefined in mock
  const planInfo = subscription?.plan_id
    ? getPlanByVariantId(subscription.plan_id)
    : FREE_PLAN;

  // 구독 정보 구성
  const currentPlan = {
    name: planInfo.name,
    price: locale === "ko" ? planInfo.priceKo : planInfo.price,
    status: subscription?.status || "inactive",
    nextBilling: subscription?.current_period_end
      ? new Date(subscription.current_period_end).toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-",
    cancelAtPeriodEnd: subscription?.cancel_at_period_end || false,
    createdAt: subscription?.created_at
      ? new Date(subscription.created_at).toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-",
  };

  // 플랜별 기능 목록 (locale 기반)
  const planFeatures =
    locale === "ko" ? planInfo.featuresKo : planInfo.features;

  // 결제 내역 통합 (구독 + 일회성)
  const allPayments: Purchase[] = [];

  // 구독 결제 추가 (구독 정보가 있는 경우 - 취소된 것도 포함)
  if (subscription) {
    // 상태 결정: cancel_at_period_end면 canceling, 아니면 실제 상태
    let displayStatus = subscription.status;
    if (
      subscription.cancel_at_period_end &&
      subscription.status !== "canceled"
    ) {
      displayStatus = "canceling";
    }

    allPayments.push({
      created_at: subscription.created_at,
      product_name: planInfo.name,
      variant_name: locale === "ko" ? "구독" : "Subscription",
      amount: planInfo.priceNumber * 100, // cents로 변환
      currency: "USD",
      status: displayStatus,
      receipt_url: undefined,
    });
  }

  // 일회성 결제 추가
  if (purchasesData) {
    allPayments.push(...purchasesData);
  }

  // Admin 여부 확인
  const isAdmin = await checkIsAdmin(user?.email);

  return (
    <DashboardSidebar isAdmin={isAdmin}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-base-content/70 mt-1">
            {t("description")}
          </p>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Content (Left 2/3) */}
          <div className="md:col-span-2 space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t("currentPlan")}</CardTitle>
                    <CardDescription>
                      {t("featuresDescription", { plan: currentPlan.name })}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      currentPlan.status === "active" &&
                      !currentPlan.cancelAtPeriodEnd
                        ? "default"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {currentPlan.cancelAtPeriodEnd
                      ? t("status.canceling")
                      : currentPlan.status === "active"
                        ? t("status.active")
                        : currentPlan.status === "inactive"
                          ? "Free"
                          : t(`status.${currentPlan.status}`) ||
                            t("status.canceled")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {t("planLabel")}
                    </span>
                    <span className="text-sm">{currentPlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {t("priceLabel")}
                    </span>
                    <span className="text-sm">{currentPlan.price}</span>
                  </div>
                  {hasActiveSubscription && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {currentPlan.cancelAtPeriodEnd
                            ? t("expirationDate")
                            : t("nextBilling")}
                        </span>
                        <span className="text-sm">
                          {currentPlan.nextBilling}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-base-content/50">
                          {t("startDateOnly")}
                        </span>
                        <span className="text-sm text-base-content/50">
                          {currentPlan.createdAt}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="pt-4 flex gap-2 flex-wrap">
                  {/* Demo mode disables billing actions */}
                  <ManageBillingButton
                    hasSubscription={hasActiveSubscription}
                    label={t("manageBilling")}
                    disabled={isDemoMode}
                  />
                  <Button
                    variant={hasActiveSubscription ? "outline" : "default"}
                    asChild={!isDemoMode}
                    disabled={isDemoMode}
                  >
                    {isDemoMode ? (
                      <span>{t("upgradeNow")}</span>
                    ) : (
                      <Link href="/pricing">
                        {hasActiveSubscription
                          ? t("changePlan")
                          : subscription?.status === "canceled"
                            ? t("restartSubscription")
                            : t("upgradeNow")}
                      </Link>
                    )}
                  </Button>
                  {hasActiveSubscription && (
                    <CancelSubscriptionButton
                      isCancelPending={subscription?.cancel_at_period_end}
                      disabled={isDemoMode}
                    />
                  )}
                </div>
                {isDemoMode && (
                  <p className="text-xs text-base-content/50 mt-2">
                    * Billing actions are disabled in Demo Mode.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Purchase History (One-time) */}
            <Card>
              <CardHeader>
                <CardTitle>{t("purchaseHistoryTitle")}</CardTitle>
                <CardDescription>
                  {t("purchaseHistoryDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allPayments.length > 0 ? (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-base-content/50 uppercase bg-base-200">
                        <tr>
                          <th className="px-4 py-3 rounded-l-lg">
                            {t("colDate")}
                          </th>
                          <th className="px-4 py-3">{t("colProduct")}</th>
                          <th className="px-4 py-3">{t("colAmount")}</th>
                          <th className="px-4 py-3">{t("colStatus")}</th>
                          <th className="px-4 py-3 rounded-r-lg text-right">
                            {t("colReceipt")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allPayments.map((purchase: Purchase, i: number) => (
                          <tr
                            key={i}
                            className="bg-base-100 border-b border-base-300"
                          >
                            <td className="px-4 py-3">
                              {new Date(
                                purchase.created_at
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 font-medium">
                              {purchase.product_name}
                              {purchase.variant_name && (
                                <span className="block text-xs text-base-content/50">
                                  {purchase.variant_name}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {(purchase.amount / 100).toLocaleString("en-US", {
                                style: "currency",
                                currency: purchase.currency || "USD",
                              })}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="capitalize">
                                {t(`status.${purchase.status}`)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {purchase.receipt_url && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0"
                                  asChild
                                >
                                  <a
                                    href={purchase.receipt_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {t("viewReceipt")}
                                  </a>
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-base-content/50 text-center py-4">
                    {t("noPurchases")}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Plan Features */}
            <Card>
              <CardHeader>
                <CardTitle>{t("featuresTitle")}</CardTitle>
                <CardDescription>
                  {t("featuresDescription", { plan: currentPlan.name })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {planFeatures.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckIcon className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Content (Right 1/3) - Future expansion area */}
          <div className="md:col-span-1" />
        </div>
      </div>
    </DashboardSidebar>
  );
}

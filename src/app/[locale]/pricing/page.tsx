"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { getCheckoutUrl } from "@/services/lemon/actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function PricingPage() {
  const t = useTranslations("Pricing");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubscribe = async (variantId: string) => {
    setLoadingId(variantId);
    try {
      const result = await getCheckoutUrl(variantId);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.url) {
        // 전체 페이지 리다이렉트 (Hosted Checkout)
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(t("error"));
    } finally {
      // 로딩 상태를 유지하며 리다이렉트 대기 (페이지 이탈 전까지 시각적 피드백 제공)
      // setLoadingId(null);
    }
  };

  const plans = [
    {
      id: "basic",
      variantId:
        process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC || "1119908",
      popular: false,
    },
    {
      id: "pro",
      variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO || "1178966",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {plans.map((plan) => {
            const planT = t.raw(`plans.${plan.id}`) as {
              name: string;
              price: string;
              description: string;
              features: string[];
            };

            return (
              <Card
                key={plan.id}
                className={`border-2 relative ${plan.popular ? "border-zinc-900 dark:border-zinc-100" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {t("popular")}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{planT.name}</CardTitle>
                  <CardDescription>{planT.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">{planT.price}</span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {t("perMonth")}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {planT.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleSubscribe(plan.variantId)}
                    disabled={loadingId !== null}
                    className="w-full mt-6"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {loadingId === plan.variantId ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("processing")}
                      </>
                    ) : (
                      t("getStarted")
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            {t("faq.title")}
          </h2>
          <div className="space-y-6">
            {(t.raw("faq.questions") as { q: string; a: string }[]).map(
              (faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-600 dark:text-zinc-400">{faq.a}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

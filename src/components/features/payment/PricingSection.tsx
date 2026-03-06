"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { PaymentProviderSelector } from "./PaymentProviderSelector";
import type { PaymentProviderType } from "./PaymentMethodCard";
import { paymentTracker } from "@/lib/payment/tracker";

interface PricingSectionProps {
  onCheckout?: (provider: PaymentProviderType, planId: string) => Promise<{ url?: string; error?: string }>;
}

export function PricingSection({ onCheckout }: PricingSectionProps) {
  const t = useTranslations("Pricing");
  const tPayment = useTranslations("Payment");

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] =
    useState<PaymentProviderType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: "basic",
      variantId:
        process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_BASIC || "1119908",
      popular: false,
      price: 9,
    },
    {
      id: "pro",
      variantId:
        process.env.NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_PRO || "1178966",
      popular: true,
      price: 29,
    },
  ];

  const handleProviderSelect = (provider: PaymentProviderType) => {
    setSelectedProvider(provider);
    if (selectedPlan) {
      paymentTracker.providerSelected(provider, selectedPlan);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (selectedProvider) {
      paymentTracker.providerSelected(selectedProvider, planId);
    }
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !selectedProvider) {
      toast.error(tPayment("selectProvider"));
      return;
    }

    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return;

    setIsLoading(true);

    paymentTracker.checkoutInitiated(selectedProvider, selectedPlan, plan.price);

    try {
      if (onCheckout) {
        const result = await onCheckout(selectedProvider, plan.variantId);

        if (result.error) {
          paymentTracker.checkoutFailed(
            selectedProvider,
            selectedPlan,
            result.error
          );
          toast.error(result.error);
          return;
        }

        if (result.url) {
          window.location.href = result.url;
        }
      } else {
        // 기본 동작: WS-1/WS-2가 구현할 getPaymentProvider 사용 예정
        toast.error("Payment provider not configured yet");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      paymentTracker.checkoutFailed(selectedProvider, selectedPlan, message);
      toast.error(t("error"));
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Step 1: Plan Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {plans.map((plan) => {
            const planT = t.raw(`plans.${plan.id}`) as {
              name: string;
              price: string;
              description: string;
              features: string[];
            };

            const isPlanSelected = selectedPlan === plan.id;

            return (
              <Card
                key={plan.id}
                className={`border-2 relative cursor-pointer transition-all hover:shadow-md ${
                  isPlanSelected
                    ? "border-zinc-900 dark:border-zinc-100 shadow-md"
                    : plan.popular
                      ? "border-zinc-400 dark:border-zinc-600"
                      : "border-zinc-200 dark:border-zinc-800"
                }`}
                onClick={() => handlePlanSelect(plan.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePlanSelect(plan.id);
                  }
                }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {t("popular")}
                  </Badge>
                )}
                {isPlanSelected && (
                  <div className="absolute top-3 right-3">
                    <CheckIcon className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
                  </div>
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Step 2: Payment Provider Selection */}
        {selectedPlan && (
          <div className="max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <PaymentProviderSelector
              selectedProvider={selectedProvider}
              onProviderSelect={handleProviderSelect}
            />
          </div>
        )}

        {/* Step 3: Checkout Button */}
        {selectedPlan && selectedProvider && (
          <div className="max-w-md mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {tPayment("processing")}
                </>
              ) : (
                tPayment("checkout")
              )}
            </Button>
          </div>
        )}

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

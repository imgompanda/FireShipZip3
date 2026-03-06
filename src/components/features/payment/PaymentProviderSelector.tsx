"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  PaymentMethodCard,
  type PaymentProviderType,
  type PaymentMethod,
} from "./PaymentMethodCard";

interface ProviderConfig {
  provider: PaymentProviderType;
  nameKey: string;
  descriptionKey: string;
  paymentMethods: PaymentMethod[];
}

const providers: ProviderConfig[] = [
  {
    provider: "lemon",
    nameKey: "lemon.name",
    descriptionKey: "lemon.description",
    paymentMethods: [
      { icon: "💳", label: "Visa" },
      { icon: "💳", label: "Mastercard" },
      { icon: "💳", label: "Amex" },
    ],
  },
  {
    provider: "paddle",
    nameKey: "paddle.name",
    descriptionKey: "paddle.description",
    paymentMethods: [
      { icon: "💳", label: "Card" },
      { icon: "🅿️", label: "PayPal" },
      { icon: "🏦", label: "Wire Transfer" },
      { icon: "🍎", label: "Apple Pay" },
      { icon: "📱", label: "Google Pay" },
    ],
  },
  {
    provider: "toss",
    nameKey: "toss.name",
    descriptionKey: "toss.description",
    paymentMethods: [
      { icon: "💳", label: "Card" },
      { icon: "💙", label: "TossPay" },
      { icon: "📱", label: "KakaoPay" },
      { icon: "💚", label: "NaverPay" },
      { icon: "🏦", label: "Bank Transfer" },
    ],
  },
];

interface PaymentProviderSelectorProps {
  selectedProvider: PaymentProviderType | null;
  onProviderSelect: (provider: PaymentProviderType) => void;
}

export function PaymentProviderSelector({
  selectedProvider,
  onProviderSelect,
}: PaymentProviderSelectorProps) {
  const t = useTranslations("Payment");
  const locale = useLocale();

  const getRecommended = (provider: PaymentProviderType): boolean => {
    if (locale === "ko") return provider === "toss";
    return provider === "paddle";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {t("selectProvider")}
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {providers.map((config) => (
          <PaymentMethodCard
            key={config.provider}
            provider={config.provider}
            name={t(config.nameKey)}
            description={t(config.descriptionKey)}
            paymentMethods={config.paymentMethods}
            isRecommended={getRecommended(config.provider)}
            isSelected={selectedProvider === config.provider}
            onSelect={onProviderSelect}
          />
        ))}
      </div>
    </div>
  );
}

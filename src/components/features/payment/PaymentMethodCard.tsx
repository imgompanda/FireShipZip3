"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PaymentProviderType } from "@/lib/payment/types";

export type { PaymentProviderType };

export interface PaymentMethod {
  icon: string;
  label: string;
}

export interface PaymentMethodCardProps {
  provider: PaymentProviderType;
  name: string;
  description: string;
  paymentMethods: PaymentMethod[];
  isRecommended: boolean;
  isSelected: boolean;
  onSelect: (provider: PaymentProviderType) => void;
}

export function PaymentMethodCard({
  provider,
  name,
  description,
  paymentMethods,
  isRecommended,
  isSelected,
  onSelect,
}: PaymentMethodCardProps) {
  const t = useTranslations("Payment");

  return (
    <Card
      className={`relative cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "border-2 border-primary bg-primary/10 shadow-md"
          : "border border-base-300 bg-base-100 hover:border-base-content/30"
      }`}
      onClick={() => onSelect(provider)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(provider);
        }
      }}
      aria-pressed={isSelected}
    >
      {isRecommended && (
        <Badge className="absolute -top-2.5 right-3 bg-primary hover:bg-primary/90 text-primary-content">
          {t("recommended")}
        </Badge>
      )}

      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <ProviderIcon provider={provider} />
          {name}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map((method) => (
            <span
              key={method.label}
              className="inline-flex items-center gap-1 rounded-full bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/70"
            >
              <span>{method.icon}</span>
              {method.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProviderIcon({ provider }: { provider: PaymentProviderType }) {
  switch (provider) {
    case "lemon":
      return <span className="text-xl">🍋</span>;
    case "paddle":
      return <span className="text-xl">🏓</span>;
    case "toss":
      return <span className="text-xl">💙</span>;
    default:
      return null;
  }
}

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

export type PaymentProviderType = "lemon" | "paddle" | "toss";

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
          ? "border-2 border-zinc-900 dark:border-zinc-100 shadow-md"
          : "border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
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
        <Badge className="absolute -top-2.5 right-3 bg-blue-600 hover:bg-blue-700 text-white">
          {t("recommended")}
        </Badge>
      )}

      {isSelected && (
        <div className="absolute top-3 right-3">
          <CheckCircle2 className="h-6 w-6 text-zinc-900 dark:text-zinc-100" />
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
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300"
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

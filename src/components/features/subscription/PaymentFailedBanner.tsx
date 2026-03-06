"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CreditCard, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface PaymentFailedBannerProps {
  daysRemaining: number;
  onUpdateCard: () => void;
}

export function PaymentFailedBanner({
  daysRemaining,
  onUpdateCard,
}: PaymentFailedBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslations("Subscription");

  if (dismissed) return null;

  // 긴급도에 따른 색상
  const isUrgent = daysRemaining <= 3;
  const bgColor = isUrgent
    ? "bg-error/10 border-error/30"
    : "bg-warning/10 border-warning/30";
  const iconColor = isUrgent ? "text-error" : "text-warning";

  return (
    <Alert className={`${bgColor} relative mb-4`}>
      <AlertTriangle className={`h-4 w-4 ${iconColor}`} />
      <AlertTitle className={isUrgent ? "text-error" : "text-warning"}>
        {t("paymentFailedTitle")}
      </AlertTitle>
      <AlertDescription
        className={isUrgent ? "text-error/80" : "text-warning/80"}
      >
        {t("paymentFailedDescription", { days: daysRemaining })}
      </AlertDescription>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant={isUrgent ? "destructive" : "default"}
          onClick={onUpdateCard}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {t("updateCard")}
        </Button>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 text-base-content/40 hover:text-base-content/60"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
}

export default PaymentFailedBanner;

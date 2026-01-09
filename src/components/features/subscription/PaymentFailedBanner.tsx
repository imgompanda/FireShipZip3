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
    ? "bg-red-50 border-red-200"
    : "bg-yellow-50 border-yellow-200";
  const iconColor = isUrgent ? "text-red-600" : "text-yellow-600";

  return (
    <Alert className={`${bgColor} relative mb-4`}>
      <AlertTriangle className={`h-4 w-4 ${iconColor}`} />
      <AlertTitle className={isUrgent ? "text-red-800" : "text-yellow-800"}>
        {t("paymentFailedTitle")}
      </AlertTitle>
      <AlertDescription
        className={isUrgent ? "text-red-700" : "text-yellow-700"}
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
        className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </Alert>
  );
}

export default PaymentFailedBanner;

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  cancelSubscription,
  reactivateSubscription,
} from "@/services/lemon/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface CancelSubscriptionButtonProps {
  isCancelPending?: boolean; // cancel_at_period_end가 true인 경우
}

export function CancelSubscriptionButton({
  isCancelPending = false,
}: CancelSubscriptionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Subscription");

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const result = await cancelSubscription();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("cancelSuccess"));
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to cancel subscription");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      const result = await reactivateSubscription();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t("reactivateSuccess"));
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to reactivate subscription");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 이미 취소 예정인 경우: 재활성화 버튼 표시
  if (isCancelPending) {
    return (
      <Button variant="outline" onClick={handleReactivate} disabled={isLoading}>
        {isLoading ? t("processing") : t("reactivate")}
      </Button>
    );
  }

  // 활성 구독인 경우: 취소 버튼 (확인 다이얼로그 포함)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isLoading}>
          {t("cancelSubscription")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("cancelConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("cancelConfirmDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("keepSubscription")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? t("processing") : t("confirmCancel")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

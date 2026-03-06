"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Copy, Check } from "lucide-react";
import { sendBetaLaunchEmail } from "@/services/email/actions";
import { useTranslations } from "next-intl";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailCaptureModal({ isOpen, onClose }: EmailCaptureModalProps) {
  const t = useTranslations("Landing.emailCapture");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const COUPON_CODE = "FIRESHIP0425";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // Send email server action
      const result = await sendBetaLaunchEmail({
        email,
        locale: "ko", // Assuming KR target for now based on context
      });

      if (result.error) {
        toast.error(t("sendFailed"));
        return;
      }

      setIsSuccess(true);
      toast.success(t("couponSent"));
    } catch (error) {
      toast.error(t("unknownError"));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setHasCopied(true);
    toast.success(t("codeCopied"));
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-base-200 border-base-content/20 text-base-content sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-base-content/50">
            {isSuccess
              ? t("congratulations")
              : t("description")}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-6 py-4">
            <div className="p-4 bg-base-300/50 rounded-xl border border-primary/30 text-center space-y-2">
              <p className="text-sm text-base-content/50">{t("discountCode")}</p>
              <div
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-3 text-2xl font-mono font-bold text-primary cursor-pointer hover:scale-105 transition-transform"
              >
                {COUPON_CODE}
                {hasCopied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5 opacity-50" />
                )}
              </div>
            </div>
            <p className="text-center text-sm text-base-content/50">
              {t("enterCodeAtCheckout")}
            </p>
            <Button
              onClick={() => {
                onClose();
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12"
            >
              {t("useNow")}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-base-300 border-base-content/20 text-base-content focus:border-primary focus:ring-primary h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("getCoupon")
              )}
            </Button>
            <p className="text-xs text-center text-base-content/70">
              {t("noSpam")}
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

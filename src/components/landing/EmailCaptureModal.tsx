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

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailCaptureModal({ isOpen, onClose }: EmailCaptureModalProps) {
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
        toast.error("이메일 발송에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setIsSuccess(true);
      toast.success("쿠폰이 발송되었습니다!");
    } catch (error) {
      toast.error("알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setHasCopied(true);
    toast.success("쿠폰 코드가 복사되었습니다!");
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-zinc-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            🎁 <span className="text-[#FFBE1A]">$100 할인</span> 쿠폰 받기
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isSuccess
              ? "축하합니다! 쿠폰이 발급되었습니다."
              : "이메일을 입력하시면 즉시 $100 할인 코드를 보내드립니다."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-6 py-4">
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-[#FFBE1A]/30 text-center space-y-2">
              <p className="text-sm text-zinc-500">할인 코드</p>
              <div
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-3 text-2xl font-mono font-bold text-[#FFBE1A] cursor-pointer hover:scale-105 transition-transform"
              >
                {COUPON_CODE}
                {hasCopied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5 opacity-50" />
                )}
              </div>
            </div>
            <p className="text-center text-sm text-zinc-500">
              이메일로도 코드가 발송되었습니다.
              <br />
              결제 시 위 코드를 입력하세요.
            </p>
            <Button
              onClick={() => {
                onClose();
                document
                  .getElementById("pricing")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full bg-[#FFBE1A] hover:bg-[#e6ab17] text-black font-bold h-12"
            >
              지금 사용하러 가기 ⚡️
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
                className="bg-zinc-900 border-zinc-700 text-white focus:border-[#FFBE1A] focus:ring-[#FFBE1A] h-12"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FFBE1A] hover:bg-[#e6ab17] text-black font-bold h-12 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  발급 중...
                </>
              ) : (
                "쿠폰 받기 ✨"
              )}
            </Button>
            <p className="text-xs text-center text-zinc-600">
              스팸은 절대 보내지 않습니다. 언제든 구독 해제 가능합니다.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

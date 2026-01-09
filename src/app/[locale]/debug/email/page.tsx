"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { sendWelcomeEmail } from "@/services/email/actions";
import { Loader2, MailCheck } from "lucide-react";

export default function EmailDebugPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleTestEmail = async () => {
    if (!email || !name) {
      toast.error("이메일과 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendWelcomeEmail({
        email,
        userName: name,
        planName: "Pro (Debug Test)",
        locale: "ko",
      });

      if (result.success) {
        toast.success("이메일 발송 요청 성공!");
        setSent(true);
      } else {
        toast.error(`발송 실패: ${result.error}`);
      }
    } catch (error) {
      toast.error("이메일 발송 중 에러가 발생했습니다.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-20 max-w-lg">
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MailCheck className="text-blue-500" />
            Resend 이메일 테스트
          </CardTitle>
          <CardDescription>
            설정된 API Key와 발신 이메일을 사용하여 환영 메일을 발송해봅니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">수신 이메일</label>
            <Input
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">수신자 이름</label>
            <Input
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button
            className="w-full"
            onClick={handleTestEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                발송 중...
              </>
            ) : (
              "테스트 이메일 보내기"
            )}
          </Button>

          {sent && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm">
              ✅ 이메일이 성공적으로 요청되었습니다! 잠시 후 수신함을
              확인해보세요.
              <br />
              (스팸함도 확인 부탁드립니다.)
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

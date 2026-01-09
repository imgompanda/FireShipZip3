"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  loginWithGoogle,
  loginWithMagicLink,
  enableDemoMode,
} from "@/services/auth/actions";
import { Loader2 } from "lucide-react";

// 1. Zod Schema Definition
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function AuthForm() {
  const t = useTranslations("Auth");
  const [message, setMessage] = useState<string | null>(null);

  // 2. Form Hook Initialization
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  // 3. Submission Handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setMessage(null);

    const res = await loginWithMagicLink(values.email);

    if (res?.error) {
      setMessage("Error: " + res.error);
    } else {
      setMessage(t("magicLinkSent"));
      form.reset();
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>{t("welcomeBack")}</CardTitle>
        <CardDescription>{t("loginDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Google Login Button */}
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full"
          type="button"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {t("googleLogin")}
        </Button>

        <Button
          variant="secondary"
          onClick={async () => {
            await enableDemoMode();
          }}
          className="w-full"
          type="button"
        >
          🚀 Try Demo Mode
        </Button>

        {/* Soft Agreement Notice */}
        <p className="text-xs text-center text-muted-foreground">
          {t.rich("softAgreement", {
            terms: (chunks) => (
              <Link href="/terms" className="underline hover:text-primary">
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href="/privacy" className="underline hover:text-primary">
                {chunks}
              </Link>
            ),
          })}
        </p>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("orContinue")}
            </span>
          </div>
        </div>

        {/* Magic Link Form (Zod + React Hook Form) */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("sendMagicLink")}
            </Button>
          </form>
        </Form>
      </CardContent>
      {message && (
        <CardFooter>
          <p className="text-sm text-center w-full text-muted-foreground">
            {message}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}

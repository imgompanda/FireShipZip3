"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { submitTicket } from "@/services/support/actions";

const formSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
  category: z.enum(["billing", "account", "technical", "general"]),
});

export function SupportTicketForm({ initialEmail }: { initialEmail?: string }) {
  const t = useTranslations("Support");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialEmail || "",
      subject: "",
      message: "",
      category: "general",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setSuccess(false);

    const result = await submitTicket({}, values);

    if (result.error) {
      setError(t("form.error")); // Or use result.error if you want technical details
    } else {
      setSuccess(true);
      form.reset();
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">{t("form.success")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setSuccess(false)} variant="outline">
            {t("form.submitAnother")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.subject")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.subject")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.priority")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.priority")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">
                        {t("category.general")}
                      </SelectItem>
                      <SelectItem value="billing">
                        {t("category.billing")}
                      </SelectItem>
                      <SelectItem value="account">
                        {t("category.account")}
                      </SelectItem>
                      <SelectItem value="technical">
                        {t("category.technical")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.message")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("form.message")}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? t("form.submitting") : t("form.submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

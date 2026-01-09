"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("FeedbackWidget");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error("Failed to send feedback");

      toast.success(t("success"));
      setMessage("");
      setOpen(false);
    } catch (error) {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 print:hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            className="rounded-full shadow-lg h-12 w-12 p-0"
            variant="default"
          >
            <MessageSquareIcon className="h-6 w-6" />
            <span className="sr-only">Feedback</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 mr-4 mb-2 p-0 overflow-hidden"
          align="end"
        >
          <div className="bg-zinc-100 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-700">
            <h3 className="font-medium text-sm">{t("title")}</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("subtitle")}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <Textarea
              placeholder={t("placeholder")}
              className="resize-none min-h-[100px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" size="sm" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                {t("submit")}
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
}

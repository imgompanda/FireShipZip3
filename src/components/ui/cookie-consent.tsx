"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const t = useTranslations("CookieConsent");

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (consent === null) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "false");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 shadow-lg z-50 animate-in slide-in-from-bottom-5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1">{t("title")}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={decline}>
            {t("decline")}
          </Button>
          <Button size="sm" onClick={accept}>
            {t("accept")}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 ml-2 sm:hidden"
            onClick={() => setShow(false)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

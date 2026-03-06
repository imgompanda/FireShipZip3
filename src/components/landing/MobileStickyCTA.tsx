"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Tag } from "lucide-react";
import { EmailCaptureModal } from "./EmailCaptureModal";
import { useTranslations } from "next-intl";

export function MobileStickyCTA() {
  const t = useTranslations("Landing.mobileCTA");
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past Hero (approx 500px)
      const show = window.scrollY > 500;
      setIsVisible(show);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 bg-base-300/80 backdrop-blur-xl border-t border-base-content/20 md:hidden animate-in slide-in-from-bottom-full duration-300">
        <div className="flex gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-content font-bold h-12 shadow-[0_0_15px_rgba(255,190,26,0.3)]"
          >
            <Tag className="w-4 h-4 mr-2" />
            {t("getDiscount")}
          </Button>
          <Button
            onClick={() => {
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            className="flex-1 border-base-content/20 bg-base-200/50 text-base-content hover:bg-base-300 h-12 font-bold"
          >
            <Zap className="w-4 h-4 mr-2" />
            {t("purchase")}
          </Button>
        </div>
      </div>

      <EmailCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

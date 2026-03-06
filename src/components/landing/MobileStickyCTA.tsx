"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Tag } from "lucide-react";
import { EmailCaptureModal } from "./EmailCaptureModal";

export function MobileStickyCTA() {
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
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 bg-black/80 backdrop-blur-xl border-t border-zinc-800 md:hidden animate-in slide-in-from-bottom-full duration-300">
        <div className="flex gap-3">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 bg-[#FFBE1A] hover:bg-[#e6ab17] text-black font-bold h-12 shadow-[0_0_15px_rgba(255,190,26,0.3)] animate-pulse"
          >
            <Tag className="w-4 h-4 mr-2" />
            $100 할인 받기
          </Button>
          <Button
            onClick={() => {
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="outline"
            className="flex-1 border-zinc-700 bg-zinc-900/50 text-white hover:bg-zinc-800 h-12 font-bold"
          >
            <Zap className="w-4 h-4 mr-2" />
            구매하기
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

"use client";

import { useState, useEffect, useRef } from "react";
import { Gift, X, Copy, Check, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import gsap from "gsap";

export function CouponPopup() {
  const t = useTranslations("Coupon");
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [hasCopied, setHasCopied] = useState(false);

  // Refs for GSAP animations
  const containerRef = useRef<HTMLDivElement>(null);
  const giftIconRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const timerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const CYCLE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in ms
    // Fixed epoch: January 6, 2026 00:00:00 KST (adjust as needed)
    const EPOCH = new Date("2026-01-06T00:00:00+09:00").getTime();

    // Calculate current cycle's end time
    const getCycleEndTime = () => {
      const now = Date.now();
      const elapsed = now - EPOCH;
      const currentCycleIndex = Math.floor(elapsed / CYCLE_DURATION);
      return EPOCH + (currentCycleIndex + 1) * CYCLE_DURATION;
    };

    let cycleEnd = getCycleEndTime();
    let hasShownConfetti = false;
    let isDismissed = false; // Track if user dismissed in this session

    // Check if dismissed in current cycle
    const currentCycleStart = cycleEnd - CYCLE_DURATION;
    const dismissedAt = localStorage.getItem("fireShipCouponDismissedAt");
    if (dismissedAt && parseInt(dismissedAt) >= currentCycleStart) {
      return; // Still in dismissed cycle
    }

    // Show confetti on first view of this cycle
    const lastConfettiCycle = localStorage.getItem(
      "fireShipCouponLastConfetti"
    );
    if (!lastConfettiCycle || parseInt(lastConfettiCycle) < currentCycleStart) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        zIndex: 9999,
      });
      localStorage.setItem(
        "fireShipCouponLastConfetti",
        currentCycleStart.toString()
      );
      hasShownConfetti = true;
    }

    // Update timer
    const interval = setInterval(() => {
      // Don't update if dismissed
      if (isDismissed) return;

      const now = Date.now();
      let diff = cycleEnd - now;

      // If cycle ended, recalculate for new cycle
      if (diff <= 0) {
        cycleEnd = getCycleEndTime();
        diff = cycleEnd - now;

        // Show confetti for new cycle
        if (!hasShownConfetti) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 },
            zIndex: 9999,
          });
          hasShownConfetti = true;
        }
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
      setIsVisible(true);
    }, 1000);

    // Store dismiss handler
    (window as Window & { __couponDismiss?: () => void }).__couponDismiss =
      () => {
        isDismissed = true;
      };

    return () => clearInterval(interval);
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (isVisible && containerRef.current) {
      const tl = gsap.timeline();

      // Initial state
      gsap.set(containerRef.current, {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotateX: 45,
      });

      // Entrance animation with bounce
      tl.to(containerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Gift icon bounce
      if (giftIconRef.current) {
        tl.fromTo(
          giftIconRef.current,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.4"
        );
      }

      // Code reveal with typewriter-like effect
      if (codeRef.current) {
        tl.fromTo(
          codeRef.current,
          { opacity: 0, y: 20, letterSpacing: "10px" },
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.1em",
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3"
        );
      }

      // Timer pulse animation
      if (timerRef.current) {
        gsap.to(timerRef.current, {
          scale: 1.05,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    }
  }, [isVisible]);

  const handleCopy = () => {
    navigator.clipboard.writeText("FIRESHIP0425");
    setHasCopied(true);
    toast.success(t("copied"));

    // GSAP copy feedback animation
    if (codeRef.current) {
      gsap.to(codeRef.current, {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    }

    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDismiss = () => {
    // Stop interval from updating
    (window as Window & { __couponDismiss?: () => void }).__couponDismiss?.();

    // GSAP exit animation
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsVisible(false);
          // Save dismiss timestamp for current cycle
          localStorage.setItem(
            "fireShipCouponDismissedAt",
            Date.now().toString()
          );
        },
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 max-w-sm w-full"
      style={{ perspective: "1000px" }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-base-200/90 p-1 backdrop-blur-xl shadow-2xl shadow-primary/10">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 opacity-50 animate-pulse" />

        <div className="relative rounded-xl bg-base-100/50 p-5">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 text-base-content/50 hover:text-base-content transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              ref={giftIconRef}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary"
            >
              <Gift size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-base-content leading-tight">
                {t("title")}
              </h3>
              <p className="text-xs font-medium text-primary uppercase tracking-wider">
                {t("discount")}
              </p>
            </div>
          </div>

          {/* Code Section */}
          <div className="bg-base-300/50 rounded-lg p-3 border border-dashed border-neutral mb-4 flex items-center justify-between gap-2 group">
            <code
              ref={codeRef}
              className="text-lg font-mono font-bold text-base-content tracking-wider"
            >
              FIRESHIP0425
            </code>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 hover:bg-base-300 text-base-content/60 hover:text-base-content"
            >
              {hasCopied ? <Check size={14} /> : <Copy size={14} />}
            </Button>
          </div>

          {/* Timer Footer */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-base-content/50 flex items-center gap-1.5">
              <Timer size={12} />
              {t("description")}
            </span>
            <span
              ref={timerRef}
              className="font-mono font-bold text-primary tabular-nums"
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

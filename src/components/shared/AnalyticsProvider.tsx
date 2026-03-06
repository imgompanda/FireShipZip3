"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "@/i18n/routing";
import {
  initAnalytics,
  trackPageView,
  trackCustom,
  trackClick,
  destroyAnalytics,
} from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pageEnteredAt = useRef(Date.now());
  const scrollMilestones = useRef(new Set<number>());

  // --- Page view + reset timers ---
  useEffect(() => {
    trackPageView(pathname);
    pageEnteredAt.current = Date.now();
    scrollMilestones.current.clear();
  }, [pathname]);

  // --- Init + cleanup ---
  useEffect(() => {
    initAnalytics();
    return () => destroyAnalytics();
  }, []);

  // --- Time on page ---
  useEffect(() => {
    const trackTimeOnPage = () => {
      const seconds = Math.round((Date.now() - pageEnteredAt.current) / 1000);
      if (seconds > 2) {
        trackCustom("time_on_page", { seconds, page: pathname });
      }
    };

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") trackTimeOnPage();
    });
    window.addEventListener("pagehide", trackTimeOnPage);

    return () => {
      trackTimeOnPage();
      window.removeEventListener("pagehide", trackTimeOnPage);
    };
  }, [pathname]);

  // --- Scroll depth ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      [25, 50, 75, 100].forEach((milestone) => {
        if (percent >= milestone && !scrollMilestones.current.has(milestone)) {
          scrollMilestones.current.add(milestone);
          trackCustom("scroll_depth", { depth: milestone, page: pathname });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // --- Section visibility (Intersection Observer) ---
  useEffect(() => {
    const seen = new Set<string>();
    const sections = document.querySelectorAll("section[id]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            trackCustom("section_view", { section: id, page: pathname });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [pathname]);

  // --- CTA & outbound link clicks ---
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      const button = target.closest("button");

      // Outbound link clicks
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        const isExternal =
          href.startsWith("http") && !href.includes(window.location.hostname);

        if (isExternal) {
          let label = "external";
          if (href.includes("latpeed.com")) label = "payment_link";
          else if (href.includes("kakao")) label = "kakao_link";
          else if (href.includes("mailto:")) label = "email_link";

          trackClick(label, { href, page: pathname });
        }
      }

      // CTA button clicks (buttons with specific text)
      if (button || anchor) {
        const el = button || anchor;
        const text = el?.textContent?.trim() || "";
        const ctaKeywords = [
          "신청", "문의", "결제", "알아보기", "시작",
          "Apply", "Contact", "Start",
        ];

        if (ctaKeywords.some((kw) => text.includes(kw))) {
          trackClick("cta_click", {
            text,
            page: pathname,
            href: anchor?.getAttribute("href") || "",
          });
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  return <>{children}</>;
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

interface SmoothScrollWrapperProps {
  children: React.ReactNode;
}

export function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Create ScrollSmoother instance
    smootherRef.current = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: contentRef.current!,
      smooth: 1.5, // Smoothing amount (higher = smoother but more lag)
      effects: true, // Enable data-speed and data-lag attributes
      smoothTouch: 0.1, // Less smooth on touch devices for better UX
    });

    return () => {
      smootherRef.current?.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} id="smooth-wrapper">
      <div ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: any; // Keep props to avoid breaking consumers
  duration?: number;
  delay?: number;
  viewport?: any;
}

// 🚨 EMERGENCY FIX: ANIMATION DISABLED 🚨
// This component is now a simple pass-through wrapper to ensure visibility.
// GSAP logic has been removed to fix critical "invisible view" bugs.

export function ScrollAnimation({ children, className }: ScrollAnimationProps) {
  return <div className={cn(className, "opacity-100 visible")}>{children}</div>;
}

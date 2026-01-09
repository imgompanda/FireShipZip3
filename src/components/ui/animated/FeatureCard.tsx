"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
}: FeatureCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-8 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,180,0,0.1), transparent 40%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {title}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

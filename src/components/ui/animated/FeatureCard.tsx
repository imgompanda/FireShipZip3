import React from "react";
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
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral bg-base-200 px-6 py-8 transition-all duration-200 hover:border-base-content/20",
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-4">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral">
            {icon}
          </div>
        )}
        <h3 className="text-xl font-bold text-base-content">
          {title}
        </h3>
        <p className="text-base-content/60 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

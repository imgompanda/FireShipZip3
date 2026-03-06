"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: string; // CSS color value (CSS variable or hex) for icon tint
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-neutral bg-base-200 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-base-content/60">{title}</p>
          <p className="text-2xl font-bold text-base-content">{value}</p>
          {change !== undefined && (
            <p
              className={`text-sm font-medium ${
                change >= 0 ? "text-success" : "text-error"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </p>
          )}
        </div>
        <div
          className="flex h-12 w-12 items-center justify-center rounded-lg"
          style={{ backgroundColor: `color-mix(in oklch, ${color} 10%, transparent)` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

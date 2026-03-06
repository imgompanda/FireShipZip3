"use client";

import type { DateRange } from "@/types/analytics";
import { useTranslations } from "next-intl";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const presets: DateRange[] = ["7d", "30d", "90d", "ytd"];

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const t = useTranslations("Admin.analytics");

  const labels: Record<DateRange, string> = {
    "7d": t("range7d"),
    "30d": t("range30d"),
    "90d": t("range90d"),
    ytd: t("rangeYtd"),
  };

  return (
    <div className="flex gap-2">
      {presets.map((preset) => (
        <button
          key={preset}
          onClick={() => onChange(preset)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            value === preset
              ? "bg-primary/10 text-primary"
              : "text-base-content/60 hover:bg-base-300"
          }`}
        >
          {labels[preset]}
        </button>
      ))}
    </div>
  );
}

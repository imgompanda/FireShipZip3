"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

const chartData: Record<TimeRange, { name: string; mrr: number }[]> = {
  daily: [
    { name: "Mon", mrr: 320 },
    { name: "Tue", mrr: 450 },
    { name: "Wed", mrr: 280 },
    { name: "Thu", mrr: 520 },
    { name: "Fri", mrr: 680 },
    { name: "Sat", mrr: 420 },
    { name: "Sun", mrr: 380 },
  ],
  weekly: [
    { name: "W1", mrr: 1800 },
    { name: "W2", mrr: 2200 },
    { name: "W3", mrr: 2800 },
    { name: "W4", mrr: 3100 },
  ],
  monthly: [
    { name: "Jan", mrr: 1200 },
    { name: "Feb", mrr: 1900 },
    { name: "Mar", mrr: 2400 },
    { name: "Apr", mrr: 3800 },
    { name: "May", mrr: 4200 },
    { name: "Jun", mrr: 5600 },
  ],
  yearly: [
    { name: "2021", mrr: 12000 },
    { name: "2022", mrr: 28000 },
    { name: "2023", mrr: 45000 },
    { name: "2024", mrr: 67000 },
  ],
};

interface AdminChartProps {
  data?: { name: string; mrr: number }[];
}

export function AdminChart({ data }: AdminChartProps) {
  const t = useTranslations("Admin.overview");
  const [timeRange, setTimeRange] = useState<TimeRange>("monthly");

  const displayData = data || chartData[timeRange];

  const rangeLabels: Record<TimeRange, string> = {
    daily: t("daily"),
    weekly: t("weekly"),
    monthly: t("monthly"),
    yearly: t("yearly"),
  };

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{t("revenueGrowth")}</CardTitle>
          <CardDescription>{t("revenueDescription")}</CardDescription>
        </div>
        <div className="flex gap-1">
          {(Object.keys(chartData) as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="text-xs"
            >
              {rangeLabels[range]}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="mrr"
                stroke="#2563eb"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

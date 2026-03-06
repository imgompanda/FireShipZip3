"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
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

const monthlyRevenueData = [
  { name: "Jan", lemon: 1200, paddle: 800, toss: 600 },
  { name: "Feb", lemon: 1500, paddle: 1200, toss: 900 },
  { name: "Mar", lemon: 1800, paddle: 1600, toss: 1400 },
  { name: "Apr", lemon: 2200, paddle: 2000, toss: 1800 },
  { name: "May", lemon: 2600, paddle: 2400, toss: 2200 },
  { name: "Jun", lemon: 3000, paddle: 2800, toss: 2600 },
];

const providerShareData = [
  { name: "LemonSqueezy", value: 38, color: "var(--chart-1)" },
  { name: "Paddle", value: 35, color: "var(--chart-3)" },
  { name: "TossPayments", value: 27, color: "var(--chart-4)" },
];

type ChartView = "bar" | "pie";

export function AdminPaymentsChart() {
  const t = useTranslations("Admin.payments");
  const [chartView, setChartView] = useState<ChartView>("bar");

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Monthly Revenue Bar Chart */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{t("monthlyRevenue")}</CardTitle>
            <CardDescription>{t("monthlyRevenueDescription")}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant={chartView === "bar" ? "default" : "outline"}
              size="sm"
              onClick={() => setChartView("bar")}
              className="text-xs"
            >
              {t("barChart")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenueData}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    color: "var(--card-foreground)",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="lemon"
                  name="LemonSqueezy"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="paddle"
                  name="Paddle"
                  fill="var(--chart-3)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="toss"
                  name="TossPayments"
                  fill="var(--chart-4)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Provider Share Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{t("providerShare")}</CardTitle>
          <CardDescription>{t("providerShareDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={providerShareData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {providerShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-2">
            {providerShareData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

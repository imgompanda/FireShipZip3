"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface BarConfig {
  key: string;
  label: string;
  color: string;
}

interface BarChartCardProps {
  data: Record<string, string | number>[];
  bars: BarConfig[];
  title: string;
  layout?: "horizontal" | "vertical";
  height?: number;
}

export function BarChartCard({
  data,
  bars,
  title,
  layout = "horizontal",
  height = 300,
}: BarChartCardProps) {
  const isVertical = layout === "vertical";

  return (
    <div className="rounded-xl border border-neutral bg-base-200 p-5">
      <h3 className="mb-4 text-lg font-semibold text-base-content">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout={isVertical ? "vertical" : "horizontal"}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={!isVertical}
              horizontal={isVertical}
            />
            {isVertical ? (
              <>
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  width={120}
                  tickLine={false}
                />
              </>
            ) : (
              <>
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
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--card-foreground)",
              }}
            />
            <Legend />
            {bars.map((bar) => (
              <Bar
                key={bar.key}
                dataKey={bar.key}
                name={bar.label}
                fill={bar.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

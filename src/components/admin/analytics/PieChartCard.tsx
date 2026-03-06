"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const DEFAULT_COLORS = [
  "oklch(var(--p))",
  "oklch(var(--in))",
  "oklch(var(--wa))",
  "oklch(var(--er))",
  "oklch(var(--n))",
];

interface PieChartCardProps {
  data: { name: string; value: number }[];
  title: string;
  colors?: string[];
  height?: number;
}

export function PieChartCard({
  data,
  title,
  colors = DEFAULT_COLORS,
  height = 300,
}: PieChartCardProps) {
  return (
    <div className="rounded-xl border border-neutral bg-base-200 p-5">
      <h3 className="mb-4 text-lg font-semibold text-base-content">{title}</h3>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(var(--b2))",
                border: "1px solid oklch(var(--b3))",
                borderRadius: "8px",
                color: "oklch(var(--bc))",
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-base-content/80 text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

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
  "#FFBE1A",
  "#4A7EC4",
  "#FFD666",
  "#ef4444",
  "#a1a1aa",
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
                backgroundColor: "#1C1C1C",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
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

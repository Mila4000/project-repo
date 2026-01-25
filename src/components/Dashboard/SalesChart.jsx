import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

function SalesChart({ salesTableData = [] }) {

  const data = useMemo(() => {
    if (!salesTableData.length) return [];

    const typeCountMap = salesTableData.reduce((acc, item) => {
      const type = item.type || "Unspecified";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCountMap).map(([type, count], index) => ({
      name: type,
      value: count,
      color: COLORS[index % COLORS.length],
    }));
  }, [salesTableData]);

  return (
    <div className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-b-2xl p-6 border-slate-200/50 dark:border-slate-700/50">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Sales by Category
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Product Type Distribution
        </p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [`${value}`, "Count"]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 mt-4">
        {data.map((item, index) => (
          <div className="flex items-center justify-between" key={index}>
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {item.name}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-800 dark:text-white">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesChart;

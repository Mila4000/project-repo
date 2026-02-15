import React from "react";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
} from "recharts";

function RevenueChart({ revenueChartData }) {
  const formatMoney = (value) => {
    const num = Math.trunc(Number(value) * 100) / 100;
    return `₱${num.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const data = revenueChartData ?? [];

  return (
    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-b-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            Revenue Breakdown
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly Sales (COGS + Profit)
          </p>
        </div>

        <div className="flex items-center space-x-6">

          {/* Profit Legend */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Profit
            </span>
          </div>

          {/* COGS Legend */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              COGS
            </span>
          </div>

        </div>
      </div>

      {/* CHART */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
              opacity={0.3}
            />

            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `₱${(Math.trunc(value * 100) / 100).toLocaleString()}`
              }
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(230, 236, 250, 0.9)",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(235, 227, 227, 0.3)",
              }}
              formatter={(value, name, props) => {
                if (name === "profit") return [formatMoney(value), "Profit"];
                if (name === "cogs") return [formatMoney(value), "COGS"];
              }}
              labelFormatter={(label, payload) => {
                if (!payload || !payload.length) return label;
                const revenue =
                  Number(payload[0].payload.revenue ?? 0);
                return `${label} — Revenue: ${formatMoney(revenue)}`;
              }}
            />

            {/* COGS (Bottom of Stack) */}
            <Bar
              dataKey="cogs"
              stackId="sales"
              fill="url(#cogsGradient)"
              radius={[0, 0, 0, 0]}
            />

            {/* PROFIT (Top of Stack) */}
            <Bar
              dataKey="profit"
              stackId="sales"
              fill="url(#profitGradient)"
              radius={[6, 6, 0, 0]}
            />

            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>

              <linearGradient id="cogsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueChart;
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TableSection({salesandweightdata, balanceData}) {
  /* ---------------------------
   * MOCK DATA (matches image)
   * --------------------------- */



  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* -------------------------------
         Monthly Sales & Weight (Line)
      -------------------------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
          Monthly Sales and Weight trends
        </h3>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesandweightdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month_label" />
              <YAxis />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="total_sales"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="total_weight"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --------------------------------
         Client / Supplier Balance (Bar)
      -------------------------------- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
          Sales and Purchased Order Balance
        </h3>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={balanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />

              <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default TableSection;

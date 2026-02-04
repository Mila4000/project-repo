import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function InventoryStatus({inventoryStatusData}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Inventory Status
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          As of: Today
        </p>
      </div>
      
      {/* Chart */}
      <div className="h-[320px] overflow-y-auto">
        <ResponsiveContainer width="100%" height={Math.max(inventoryStatusData.length * 60, 300)}>
          <BarChart
            data={inventoryStatusData}
            layout="vertical"
            margin={{ left: 80 }}
          >
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="item_name"
              width={140}
            />
            <Tooltip />
            <Bar
              dataKey="quantity"
              fill="#a78bfa"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default InventoryStatus;

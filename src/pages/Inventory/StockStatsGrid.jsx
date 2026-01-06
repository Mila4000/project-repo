import React from 'react'
import { Package, ChartNoAxesColumnIncreasing, Wallet, TriangleAlert} from 'lucide-react';


function StockStatsGrid({stats}) {
    if (!stats) return null;
    const gridStats = [
    {
      title: "Total Products",
      value: `${stats.totalProduct}`,
      icon: Package,
      color: "from-green-500 to-teal-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total Stock",
      value: `${stats.totalStock}`,
      icon: ChartNoAxesColumnIncreasing,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Total Value",
      value: `${stats.totalVal}`,
      icon: Wallet,
      color: "from-yellow-500 to-orange-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Stock Alert",
      value: `${stats.totalCritStock}`,
      icon: TriangleAlert,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
      textColor: "text-red-600",
    },
  ];
  return (
    <div className = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 text-black dark:text-white">
        {gridStats.map((stats, index) => { 
            return (
              <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50" key={index}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      {stats.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                      {stats.value}
                    </p>
                  </div>

                  <div className = {`p-3 rounded-xl ${stats.bgColor} group-hover:scale-110 transition-all duration-300`}>
                    <stats.icon className = {`w-6 h-6 ${stats.textColor}`} />
                  </div>
                </div>
              </div>
            );
            }
        )}
    </div>
  );
};

export default StockStatsGrid;
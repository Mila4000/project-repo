import React from 'react'
import { Tag } from 'lucide-react';



function BrandListStatsGrid( {stats={}}) {
  if (!stats) return null;
    const gridStats = [
    {
      title: "Total Brands",
      value: stats.toLocaleString() || 0,
      icon: Tag,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    }
  ];
  return (
    <div className = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8 text-black dark:text-white">
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
  )
}
export default BrandListStatsGrid;
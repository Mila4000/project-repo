import React from 'react'
import { DollarSign, Scale, Wallet, Truck} from 'lucide-react';

function PurchasedStatsGrid({ stats }) {
  if (!stats) return null;

  const gridStats = [
    {
      title: "Total Purchased(in ₱)",
      value: `₱${stats.totalPurchased.toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-600",
    },
    { title: "Total KG Purchased", 
      value: `${stats.totalQuantity.toLocaleString()} KG`,
      icon: Scale, color: "from-purple-500 to-pink-600", 
      bgColor: "bg-purple-50 dark:bg-purple-900/20", 
      textColor: "text-purple-600 dark:text-purple-400", 
    },
    {
      title: "Total Payables",
      value: `$${stats.totalPayables.toLocaleString()}`,
      icon: Wallet,
      bgColor: "bg-amber-100",
      textColor: "text-amber-600",
    },
    {
      title: "Total Received Deliveries",
      value: stats.totalDeliveries,
      icon: Truck,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    }
  ];

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 text-black dark:text-white">
    {gridStats.map((item, index) => (
      <div
        key={index}
        className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
              {item.title}
            </p>

            <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
              {typeof item.value === "number"
                ? item.value.toLocaleString("en-US", { style: "currency", currency: "USD" })
                : item.value
              }
            </p>
          </div>

          <div
            className={`p-3 rounded-xl ${item.bgColor} group-hover:scale-110 transition-all duration-300`}
          >
            <item.icon className={`w-6 h-6 ${item.textColor}`} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

}
export default PurchasedStatsGrid;
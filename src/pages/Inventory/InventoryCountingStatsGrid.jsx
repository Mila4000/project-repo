import React, {useState,useEffect} from 'react'
import {Package} from 'lucide-react';
const stats = [
  {
    title: "Total Counting",
    value: "123,456",
    icon: Package,
    color: "from-green-500 to-teal-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
    textColor: "text-emerald-600 dark:text-emerald-400",
  }
];

function InventoryCountingStatsGrid() {
  const [totalCounting, setTotalCounting] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory/stats`);
        const count= await res.json();
        setTotalCounting(count ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);
    const stats = [
    {
      title: "Total Counting",
      value: loading ? "—" : totalCounting.toLocaleString(),
      icon: Package,
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    }
  ];

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8 text-black dark:text-white">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                {stat.title}
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
                {stat.value}
              </p>
            </div>

            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

}

export default InventoryCountingStatsGrid;
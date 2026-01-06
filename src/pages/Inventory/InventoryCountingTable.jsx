import React from 'react';
import { MoreHorizontal } from 'lucide-react'; 

function InventoryCountingTable({ orders }) {
    
    const getStatusColor = (Status) => {
        switch (Status) {
            case "Approved":
              return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Pending":
              return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Rejected":
              return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
              return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto pb-6 mt-4">
          <table className="w-full">
            <thead>
                <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Warehouse</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Remarks</th> 
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Counting Date</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    return (
                      <tr key={order.id} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4" key={index}>
                          <span className="text-sm font-medium text-blue-500">
                            {order.warehouse}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.remarks}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.count_date}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getStatusColor(order.status)}`}> 
                                {order.status} 
                          </span>
                        </td>
                        <td className="p-4 text-center"> 
                          <span className="text-sm text-slate-800 dark:text-white">
                            <MoreHorizontal className="w-4 h-4"/>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
            </table>
        </div>
    );
}

export default InventoryCountingTable;
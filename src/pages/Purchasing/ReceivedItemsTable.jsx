import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; 

function PurchasedOrdersTable({ orders, onEdit }) {
    
    const getDeliveryStatusColor = (Status) => {
        switch (Status) {
            case "Delivered":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Out for Delivery":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Order Placed":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto pb-6 mt-4">
          <table className="w-full">
            <thead>
                <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">PO No.</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Transaction Date</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                    <th className="text-center p-4 px-2 text-sm font-semibold text-slate-600 dark:text-slate-200">Expected Quantity</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actual Quantity</th>
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total Kilo</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Remarks</th> 
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    return (
                      <tr key={order.PO} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4" key={index}>
                          <span className="text-sm font-medium text-blue-500">
                            {   order.PO}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.itemName}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.supplier}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.transaction_date}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getDeliveryStatusColor(order.deliveryStatus)}`}> 
                                {order.deliveryStatus} 
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.expectedQuantity}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.actualQuantity}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-sm text-slate-800 dark:text-white">
                                {order.totalKilo}
                          </span>
                        </td>
                        <td className="p-4"> 
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.remarks}
                            </span>
                        </td>
                        <td className="p-4 flex items-center gap-3"> 
                            <button 
                                className="text-sm text-blue-800 dark:text-blue-400 hover:scale-110 transition-transform"
                                onClick={() => onEdit(order)}
                            >
                                <Pencil className="w-4 h-4"/>
                            </button>
                            <button 
                                className="text-sm text-red-800 dark:text-red-400 hover:scale-110 transition-transform"
                                title="Delete Supplier"
                            >
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
            </table>
        </div>
    );
}

export default PurchasedOrdersTable;
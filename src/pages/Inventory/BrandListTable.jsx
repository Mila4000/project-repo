import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; 

function BrandListTable({ orders, onEdit, onDelete }) {
    const getStatusColor = (Status) => {
        switch (Status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Inactive":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full mb-2">
                <thead>
                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">ID</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => {
                    return (
                        <tr key={index} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4">
                                <span className="text-sm font-medium text-blue-500">
                                    {order.id}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm font-medium text-black-500">
                                    {order.brand_name}
                                </span>
                            </td>
                            <td className="p-4 flex items-center gap-3"> 
                                <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                    onClick={() => onEdit(order)}
                                >
                                    <Pencil className="w-4 h-4"/>
                                </span>
                                <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer"
                                    onClick={()=>onDelete(order.id)}>
                                    <Trash2 className="w-4 h-4"/>
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

export default BrandListTable;
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; 

function SupplierListTable({ suppliers, onEdit, onDelete }) {
    
    const getStatusColor = (status) => {
        switch (status) {
            case "Active":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Inactive":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full mb-2">
                <thead>
                    <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Business Name</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Email/Address</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Contact No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">TIN No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Bank Account No.</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier) => (
                        <tr key={supplier.name} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="p-4">
                                <span className="text-sm font-medium text-blue-500">
                                    {supplier.name}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {supplier.businessname}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {supplier.email}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {supplier.contactno}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {supplier.tinno}
                                </span>
                            </td>
                            <td className="w-52 p-4">
                                <span className="text-sm text-slate-800 dark:text-white">
                                    {supplier.bankaccount}
                                </span>
                            </td>
                            <td className="w-40 p-4 text-left">
                                <span className={`font-medium text-xs px-3 py-1 rounded-full ${getStatusColor(supplier.status)}`}>
                                    {supplier.status}
                                </span>
                            </td>
                            <td className="p-4 flex items-center gap-3"> 
                                <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                    onClick={() => onEdit(supplier)}
                                >
                                <Pencil className="w-4 h-4"/>
                                </span>
                                <span
                                className="text-sm text-red-800 dark:text-red-400 cursor-pointer hover:scale-110 transition"
                                onClick={() => onDelete(supplier.id)}
                                >
                                <Trash2 className="w-4 h-4" />
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SupplierListTable;
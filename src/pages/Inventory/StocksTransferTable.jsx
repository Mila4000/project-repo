import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react'; 

import CustomSupplierSelect from '../../components/filter/CustomSupplierSelect'; 
import CustomPaymentStatusSelect from '../../components/filter/CustomPaymentStatusSelect'; 

const StocksTransferData = [
{
    id: 1,
    TransferDate: '10/10/2025', 
    Sender: "Saog", 
    Receiver: 'Meycuayan', 
    Remarks: 'Restock', 
    TotalQuantity: '50.00', 
    TotalValue: '11,000.00', 
    Status: 'Delivered' 
},
{
    id: 2,
    TransferDate: '10/11/2024', 
    Sender: "Saog", 
    Receiver: 'Quezon City', 
    Remarks: 'Restock Jowls', 
    TotalQuantity: '50.00', 
    TotalValue: '10,750.00', 
    Status: 'In Transit' 
},
{
    id: 3,
    TransferDate: '10/11/2024', 
    Sender: "Quezon City", 
    Receiver: 'Saog', 
    Remarks: 'Shift Stock', 
    TotalQuantity: '10.15', 
    TotalValue: '4719.75', 
    Status: 'Delayed' 
},
{
    id: 4,
    TransferDate: '12/25/2025', 
    Sender: "Meycuayan", 
    Receiver: 'Saog', 
    Remarks: 'Move Meat', 
    TotalQuantity: '5.17', 
    TotalValue: '1240.80', 
    Status: 'Cancelled' 
}
];

const ALL_OPTION = 'All';

function StocksTransferTable({ rowLimit, currentPage, onTotalDataChange, onAddStockTransferClick, iconProps, onEditStockTransferClick, OnDeleteCountingClick }) {
    // --- 1. INITIAL STATES (Recalibrated to match placeholders) ---
    const [dateFilter, setDateFilter] = useState('Transfer Date');
    const [senderFilter, setSenderFilter] = useState('Sender');
    const [receiverFilter, setReceiverFilter] = useState('Receiver');
    const [statusFilter, setStatusFilter] = useState('Status');

    // --- 2. DYNAMIC OPTIONS ---
    const dateOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.TransferDate))];
        return ['Transfer Date', ALL_OPTION, ...unique.sort()];
    }, []);

    const senderOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.Sender))];
        return ['Sender', ALL_OPTION, ...unique.sort()];
    }, []);

    const receiverOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.Receiver))];
        return ['Receiver', ALL_OPTION, ...unique.sort()];
    }, []);

    const statusOptions = useMemo(() => {
        const unique = [...new Set(StocksTransferData.map(item => item.Status))];
        return ['Status', ALL_OPTION, ...unique.sort()];
    }, []);

    // --- 3. FILTERING LOGIC (Recalibrated for Placeholders) ---
    const filteredData = useMemo(() => {
        return StocksTransferData.filter(item => {
            // If the state matches the placeholder string, it evaluates to TRUE (don't filter)
            const matchDate = dateFilter === 'Transfer Date' || dateFilter === ALL_OPTION || item.TransferDate === dateFilter;
            const matchSender = senderFilter === 'Sender' || senderFilter === ALL_OPTION || item.Sender === senderFilter;
            const matchReceiver = receiverFilter === 'Receiver' || receiverFilter === ALL_OPTION || item.Receiver === receiverFilter;
            const matchStatus = statusFilter === 'Status' || statusFilter === ALL_OPTION || item.Status === statusFilter;

            return matchDate && matchSender && matchReceiver && matchStatus;
        });
    }, [dateFilter, senderFilter, receiverFilter, statusFilter]);

    // --- 4. SYNC TOTAL COUNT FOR PAGINATION ---
    useEffect(() => {
        if (onTotalDataChange) {
            onTotalDataChange(filteredData.length);
        }
    }, [filteredData.length, onTotalDataChange]);

    // --- 5. PAGINATION SPLICING ---
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowLimit;
        return filteredData.slice(start, start + rowLimit);
    }, [filteredData, rowLimit, currentPage]);

    const getStatusColor = (Status) => {
        switch (Status) {
            case "Delivered": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "In Transit": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Delayed": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "Cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };

    return (
        <div className="overflow-x-auto pb-6 mt-4 min-h-[400px]">
            {/* FILTER CONTROLS */}
            <div className="flex items-center justify-between gap-3 py-2 mb-3 relative z-40">
                <div className="flex items-center gap-3">
                    <CustomSupplierSelect
                        options={dateOptions}
                        initialValue="Transfer Date"
                        onSelect={setDateFilter}
                        iconProps={iconProps}
                    />
                    <CustomSupplierSelect
                        options={senderOptions}
                        initialValue="Sender"
                        onSelect={setSenderFilter}
                        iconProps={iconProps}
                    />
                    <CustomSupplierSelect
                        options={receiverOptions}
                        initialValue="Receiver"
                        onSelect={setReceiverFilter}
                        iconProps={iconProps}
                    />
                    <CustomPaymentStatusSelect
                        options={statusOptions}
                        initialValue="Status"
                        onSelect={setStatusFilter}
                        iconProps={iconProps}
                    />
                </div>
                <button 
                    onClick={onAddStockTransferClick}
                    type="button" className="cursor-pointer flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Transfer</span>
                </button>
            </div>

            {/* DATA TABLE */}
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Transfer Date</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Sender</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Receiver</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Remarks</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Qty (KG)</th>
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total Value</th>
                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Status</th>
                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((order, index) => (
                            <tr key={`${order.id}`} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-blue-500">{order.TransferDate}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{order.Sender}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{order.Receiver}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{order.Remarks}</td>
                                <td className="p-4 text-sm text-left text-slate-800 dark:text-white">{order.TotalQuantity}</td>
                                <td className="p-4 text-sm text-left text-slate-800 dark:text-white">{order.TotalValue}</td>
                                <td className="p-4 text-center">
                                    <span className={`font-medium text-xs px-3 py-1 rounded-full ${getStatusColor(order.Status)}`}>
                                        {order.Status}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center justify-center gap-3"> 
                                    <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                        onClick={() => onEditStockTransferClick(order)}
                                    >
                                        <Pencil className="w-4 h-4"/>
                                    </span>
                                    <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer"
                                        onClick={() => OnDeleteCountingClick(order, index)}
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="p-16 text-center text-slate-500 italic">
                                No transfers found matching the selected filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default StocksTransferTable;
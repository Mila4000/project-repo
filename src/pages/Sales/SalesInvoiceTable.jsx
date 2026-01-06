import React from 'react';
import { Pencil, Trash2, ReceiptText } from 'lucide-react'; 

function SalesInvoiceTable({ orders, onEdit, onViewReceipt, suppliers }) {
    // NOTE: The static PurchasedOrders data is removed and now received via the 'orders' prop.
    const getApprovalStatusColor = (approvalStatus) => {
        switch (approvalStatus) {
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
    
    const getDeliveryStatusColor = (deliveryStatus) => {
        switch (deliveryStatus) {
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

    const getPaymentStatusColor = (paymentStatus) => {
        switch (paymentStatus) {
            case "Paid":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Unpaid":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            case "N/A":
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
            default:
                return "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400";
        }
    };
    const getSupplierById = (id) => {
        return suppliers.find(supplier => supplier.id === id);
    }
    return (
        <div className="overflow-x-auto pb-6 mt-4">
          <table className="w-full">
            <thead>
                <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">PO No.</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Transaction Date</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Approval Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Delivery Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Payment Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Remarks</th> 
                    <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => {
                    return (
                      <tr key={order.po} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4" key={index}>
                          <span className="text-sm font-medium text-blue-500">
                            {order.po}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {getSupplierById(order.supplier_id)?.businessname ?? "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.transaction_date}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-slate-800 dark:text-white">
                            {order.total} 
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getApprovalStatusColor(order.approval_status)}`}> 
                            {order.approval_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getDeliveryStatusColor(order.delivery_status)}`}>
                            {order.delivery_status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-medium text-xs px-3 py-1 rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="p-4"> 
                            <span className="text-sm text-slate-800 dark:text-white">
                                {order.remarks}
                            </span>
                        </td>
                        <td className="p-4 flex items-center justify-center gap-3"> 
                          <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                            onClick={() => onEdit(order)}
                          >
                            <Pencil className="w-5 h-5"/>
                          </span>
                          <span className="text-sm text-blue-900 dark:text-blue-500 cursor-pointer"
                            onClick={() => onViewReceipt(order)}
                          >
                            <ReceiptText className="w-5 h-5"/>
                          </span>
                          <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer">
                            <Trash2 className="w-5 h-5"/>
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

export default SalesInvoiceTable;
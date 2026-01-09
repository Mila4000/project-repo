import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

function DeliveryStatusModal({
    isOpen,
    onClose,
    purchaseOrderId,
    currentStatus,
}) {
    const [status, setStatus] = useState(currentStatus || "Order Placed");
    const [remarks, setRemarks] = useState("");
    const [statusHistory, setStatusHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔹 Fetch history when modal opens
    useEffect(() => {
        if (!isOpen) return;

        const fetchHistory = async () => {
            setLoadingHistory(true);
            try {
            const response = await fetch(
                `http://localhost:5000/api/purchasing/delivery-status-history/${purchaseOrderId}`
            );

            const data = await response.json();
            setStatusHistory(data);
            } catch (error) {
            console.error("Fetch status history error:", error);
            } finally {
            setLoadingHistory(false);
            }
        };

        fetchHistory();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(
                `http://localhost:5000/api/purchasing/update-delivery-status/${purchaseOrderId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status, remarks }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update delivery status");
            }

            // Optimistic append (optional)
            setStatusHistory((prev) => [
                {
                    created_at: new Date().toISOString(),
                    remarks,
                    delivery_status: status,
                },
                ...prev,
            ]);

            setRemarks("");
        } catch (error) {
            console.error("Update delivery status error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700">

                {/* Header */}
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        Update Delivery Status
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Status & Remarks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-10 px-3 rounded-md border dark:bg-slate-700"
                            >
                                <option>Order Placed</option>
                                <option>Out for Delivery</option>
                                <option>Overdue (X Days)</option>
                                <option>Delivered</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Remarks
                            </label>
                            <textarea
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 rounded-md border dark:bg-slate-700 resize-none"
                            />
                        </div>
                    </div>

                    {/* STATUS HISTORY TABLE */}
                    <div className="rounded-md border overflow-hidden">
                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-700">
                            <p className="text-sm font-medium">Status History</p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingHistory ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-4 text-center">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : statusHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-4 text-center text-slate-500">
                                                No history found
                                            </td>
                                        </tr>
                                    ) : (
                                        statusHistory.map((row, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="px-4 py-3">
                                                    {new Date(row.created_at).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {row.status}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {row.remarks || "-"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-8 py-2 bg-blue-600 text-white rounded-md">
                            {isSubmitting ? "Saving..." : "Save Status"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeliveryStatusModal;

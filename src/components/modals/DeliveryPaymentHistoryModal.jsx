import React, { useState,useEffect } from 'react';
import { X, Eye } from 'lucide-react';
import ProofOfPaymentModal from './ProofOfPaymentModal';

function DeliveryPaymentHistoryModal({ isOpen, onClose,displayData }) {
     const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isProofOpen, setIsProofOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const money = (value) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }).format(Number(value || 0));

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    /* ---------------- FETCH PAYMENT HISTORY ---------------- */
    useEffect(() => {
        if (!isOpen || !displayData?.id) return;

        const fetchPaymentHistory = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/purchasing/payment-history/${displayData.id}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch payment history");
                }

                const data = await response.json();
                setPaymentHistory(data);
            } catch (error) {
                console.error("Payment history error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentHistory();
    }, [isOpen, displayData?.id]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Payment History Details</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>
                <div className="overflow-x-auto pb-6 mt-5">
                    <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Payment History
                    </p>
                    <div className="w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                                    <th className="px-3 py-3 text-sm text-center">Date</th>
                                    <th className="px-3 py-3 text-sm text-center">Amount</th>
                                    <th className="px-3 py-3 text-sm text-center">Method</th>
                                    <th className="px-3 py-3 text-sm text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-sm">
                                            Loading...
                                        </td>
                                    </tr>
                                )}

                                {!loading && paymentHistory.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-sm">
                                            No payment history found
                                        </td>
                                    </tr>
                                )}

                                {!loading &&
                                    paymentHistory.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                                        >
                                            <td className="text-center px-3 py-4 text-sm">
                                                {formatDate(payment.created_at)}
                                            </td>

                                            <td className="text-center px-3 py-4 text-sm">
                                                {money(payment.amount_paid)}
                                            </td>

                                            <td className="text-center px-3 py-4 text-sm capitalize">
                                                {payment.payment_method || "—"}
                                            </td>

                                            <td className="text-center px-3 py-4">
                                                <Eye
                                                    onClick={() => {
                                                        setSelectedPayment(payment);
                                                        setIsProofOpen(true);
                                                    }}
                                                    className="w-5 h-5 mx-auto text-blue-500 cursor-pointer hover:text-blue-600"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Remaining Balance
                    </p>

                    <div className="w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                        <table className="w-full">
                            <tbody>
                                <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">
                                        Merchandise Subtotal
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                                        {money(displayData.merchandise_subtotal)}
                                    </td>
                                </tr>

                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">
                                        Shipping Subtotal
                                    </td>
                                    <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                                        {money(displayData.shipping_subtotal)}
                                    </td>
                                </tr>

                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">
                                    Item Discount Subtotal
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                                    {money(displayData.discount_subtotal)}
                                </td>
                                </tr>

                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">
                                    Order Discount
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                                    {money(0)}
                                </td>
                                </tr>

                                <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold">
                                    Amount Due
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">
                                    {money(displayData.total - displayData.amount_paid)}
                                </td>
                                </tr>

                                <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold">
                                    Total Paid
                                </td>
                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">
                                    {money(displayData.amount_paid)}
                                </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ProofOfPaymentModal 
                isOpen={isProofOpen} 
                onClose={() => setIsProofOpen(false)} 
            />
        </div>
    );
}

export default DeliveryPaymentHistoryModal;
import React, {  useState } from 'react';
import { X } from 'lucide-react';

function PayDeliveryNowModal({ isOpen, onClose , displayData, transactType}) {
    const money = (value) =>
    new Intl.NumberFormat("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
    const maxAmountPay =
    (Number(displayData.total) || 0) -
    (Number(displayData.amount_paid) || 0);

    const [amountPay, setAmountPay] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");

    const handleSubmitPayment = async (e) => {
    e.preventDefault();

    const payment = {
        amountPay: Number(amountPay),
        paymentMethod,
        remainingBalance: maxAmountPay,
    };
    
    try {
        
        const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/${transactType}/payment/${displayData.id}`,
        {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payment),
        }
        );

        if (!response.ok) {
        throw new Error("Payment failed");
        }

        // ✅ RESET FORM AFTER SUCCESS
        setAmountPay("");
        setPaymentMethod("");

        onClose();
    } catch (error) {
        console.error(error);
    }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-2xl mx-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Confirm Payment</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-500" />
                    </button>
                </div>

                
                <div className = "space-y-10">
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


                    <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Details</p>

                    <form
                        onSubmit={handleSubmitPayment}
                        className="w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 space-y-2"
                        >
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            
                            {/* Amount to Pay */}
                            <div>
                            <p className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Amount to Pay
                            </p>
                            <input
                                type="number"
                                min="0"
                                max={maxAmountPay}
                                value={amountPay}
                                onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value <= maxAmountPay) {
                                    setAmountPay(e.target.value);
                                }
                                }}
                                className="w-full text-slate-700 
                                dark:text-slate-200 mt-1 px-3 py-1.5 h-9 
                                rounded-md border border-slate-300 dark:border-slate-600 
                                bg-white dark:bg-slate-700 shadow-xs focus:outline-none 
                                focus:border-blue-500 dark:focus:border-blue-500 
                                focus:caret-slate-500 dark:focus:caret-white"
                            />
                            <p className="text-xs text-slate-500 mt-1">
                                Max: {maxAmountPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                            </div>

                            {/* Payment Method */}
                            <div>
                            <p className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Payment Method
                            </p>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full text-slate-700 
                                dark:text-slate-200 mt-1 px-3 py-1.5 h-9 
                                rounded-md border border-slate-300 dark:border-slate-600 
                                bg-white dark:bg-slate-700 shadow-xs focus:outline-none 
                                focus:border-blue-500 dark:focus:border-blue-500"
                            >
                                <option value="">Select payment method</option>
                                <option value="cash">Cash</option>
                                <option value="gcash">GCash</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                            </div>
                        </div>

                        {/* Total Payment */}
                        <div className="p-4 bg-slate-200/50 dark:bg-slate-700/50 transition-colors">
                            <div className="flex items-center justify-between">
                            <p className="font-bold text-slate-700 dark:text-slate-300">
                                Total Payment
                            </p>
                            <p className="font-bold text-slate-700 dark:text-slate-300">
                                {(Number(amountPay) || 0).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                })}
                            </p>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="pt-5 flex justify-end space-x-3">
                    <button type="button" onClick={onClose}
                    className="px-6 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200/90 bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600/80 hover:bg-slate-200/80 transition-colors">
                        Cancel
                    </button>
                    <button type="submit"
                    onClick={handleSubmitPayment}
                    className="px-8 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                    Pay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PayDeliveryNowModal;
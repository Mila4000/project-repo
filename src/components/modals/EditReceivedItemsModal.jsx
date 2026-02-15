import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
/* import ModalCustomFormSelect from '../../components/filter/ModalCustomFormSelect'; 


const deliveryStatusOptions = [
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Out for Delivery', value: 'Out for Delivery' },
    { label: 'Order Placed', value: 'Order Placed' }
]; */

function EditReceivedItemsModal({ isOpen, onClose, itemData, onSave }) {
    const [formData, setFormData] = useState({});
    useEffect(() => {
        if (itemData) setFormData(itemData);
    }, [itemData]);

    if (!isOpen) return null;

    const handleInputChange = (input) => {
        let name, value;

        if (input.target) {
            // Logic for standard <input> (e.target)
            name = input.target.name;
            value = input.target.value;
        } else {
            name = input.name;
            value = input.value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
        id: formData.id,
        product_name: formData.product_name,
        quantity: Number(formData.quantity),
        expected_quantity: Number(formData.expected_quantity),
    };

    onSave(payload);
    };
   const handleDeliver = async () => {
        try {
            const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/received-items/${formData.purchased_order_id}/deliver`,
            { method: 'PUT' }
            );

            const data = await res.json(); // ALWAYS read response

            if (!res.ok) {
            console.error('Backend error response:', data);
            throw new Error(data.message || 'Failed to deliver');
            }

            console.log('Success:', data);
            onClose();
        } catch (err) {
            console.error('Deliver error:', err);
        }
    };
    console.log("FormData", formData);
    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div
                className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4"
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}
                <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Edit Received Item
                </h2>

                <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                    <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer" />
                </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                {/* TOP DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        PO Number
                    </label>
                    <input
                        value={formData.po_number || ""}
                        readOnly
                        className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 
                                dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 
                                text-slate-700 dark:text-slate-200 cursor-not-allowed"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Transaction Date
                    </label>
                    <input
                        value={formData.transaction_date || ""}
                        readOnly
                        className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 
                                dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 
                                text-slate-700 dark:text-slate-200 cursor-not-allowed"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Supplier Name
                    </label>
                    <input
                        value={formData.supplier || ""}
                        readOnly
                        className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 
                                dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 
                                text-slate-700 dark:text-slate-200 cursor-not-allowed"
                    />
                    </div>

                    <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Contact Number
                    </label>
                    <input
                        value={formData.contact || ""}
                        readOnly
                        className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 
                                dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 
                                text-slate-700 dark:text-slate-200 cursor-not-allowed"
                    />
                    </div>
                </div>

                {/* PRODUCT TABLE */}
                <div className="overflow-x-auto pb-3">
                    <div className="flex items-center justify-between mb-3">
                    <h1 className="text-[#535353] dark:text-white text-xl font-bold">
                        Product Details
                    </h1>
                    </div>

                    <table className="w-full">
                    <thead>
                        <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">
                            Item Name
                        </th>
                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">
                            Expected Quantity
                        </th>
                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">
                            Actual Quantity
                        </th>
                        </tr>
                    </thead>

                    <tbody>
                        {formData && (
                        <tr>
                            <td className="p-4">{formData.product_name}</td>

                            <td className="p-4 text-center">
                            {formData.expected_quantity}
                            </td>

                            <td className="p-3 text-center">
                            <input
                                type="number"
                                min="0"
                                value={formData.quantity || ""}
                                onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    quantity: Number(e.target.value),
                                }))
                                }
                                className="w-full text-center rounded-md border border-slate-300 dark:border-slate-600 px-2 py-1"
                            />
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>

                {/* ACTION BUTTONS */}
                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md 
                                    text-slate-700 dark:text-slate-300 bg-slate-100 
                                    dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 
                                    transition-colors"
                        >
                        Cancel
                        </button>

                        {/* Show Deliver button only if quantity is less than expected */}
                        {itemData.quantity < itemData.expected_quantity &&  (
                        <button
                            type="button"
                            onClick={handleDeliver}
                            className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md 
                                        text-white bg-green-600 hover:bg-green-700 
                                        transition-colors shadow-md"
                        >
                            Deliver
                        </button>
                        )}

                        <button
                        type="submit"
                        onClick={() => onSave(formData)}
                        className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md 
                                    text-white bg-blue-600 hover:bg-blue-700 
                                    transition-colors shadow-md"
                        >
                        Update Item
                        </button>
                </div>
                </form>
            </div>
            </div>
    );
}
export default EditReceivedItemsModal;
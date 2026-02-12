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

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>

                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold dark:text-white text-slate-800">Edit Received Item</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* PO Number */}
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        PO Number
                    </label>
                    <input
                        name="purchased_order_id"
                        value={formData.po_number || ''}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
                                cursor-not-allowed"
                        readOnly
                        disabled
                    />
                    </div>

                    {/* Item Name */}
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Item Name
                    </label>
                    <input
                        name="product_name"
                        value={formData.product_name || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
                                cursor-not-allowed"
                                readOnly
                                disabled
                    />
                    </div>

                    {/* Supplier */}
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Supplier
                    </label>
                    <input
                        name="supplier"
                        value={formData.supplier || ''}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
                                cursor-not-allowed"
                        readOnly
                        disabled
                    />
                    </div>

                    {/* Transaction Date */}
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Transaction Date
                    </label>
                    <input
                        name="transaction_date"
                        value={formData.transaction_date || ''}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
                                cursor-not-allowed"
                        readOnly
                        disabled
                    />
                    </div>

                    {/* Expected Quantity */}
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Expected Quantity
                    </label>
                    <input
                        name="expected_quantity"
                        value={formData.expected_quantity}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
                                cursor-not-allowed"
                        readOnly
                        disabled
                    />
                    </div>

                    {/* Actual Quantity */}
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Actual Quantity
                    </label>
                    <input
                        name="quantity"
                        type="number"
                        min="0"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200
                                focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    </div>

                    {/* Delivery Status */}
                    <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Delivery Status
                    </label>
                    <input
                        name="delivery_status"
                        value={formData.delivery_status || ''}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
                                cursor-not-allowed"
                        readOnly
                        disabled
                    />
                    </div>

                    {/* Remarks */}
                    <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Remarks
                    </label>
                    <textarea
                        name="remarks"
                        rows={3}
                        value={formData.remarks || ''}
                        className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-600
                                bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400
                                resize-none cursor-not-allowed"
                        readOnly
                        disabled
                    />
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                    <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline"
                    >
                    Cancel
                    </button>

                    <button
                    type="submit"
                    onClick={() => onSave(formData)}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700
                                text-white rounded-lg shadow-md shadow-blue-500/30"
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
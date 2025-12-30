import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ModalCustomFormSelect from '../../components/filter/ModalCustomFormSelect'; 


const deliveryStatusOptions = [
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Out for Delivery', value: 'Out for Delivery' },
    { label: 'Order Placed', value: 'Order Placed' }
];

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
            // Logic for ModalCustomFormSelect (passed as { name, value })
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
        onSave(formData);
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

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">PO Number</label>
                            <input name="Name" value={formData.PO || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 shadow-xs text-slate-500 dark:text-slate-400" readOnly disabled/>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Item Name</label>
                            <input name="Name" value={formData.itemName || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Supplier</label>
                            <input name="Name" value={formData.supplier || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Date</label>
                            <input name="Name" value={formData.transaction_date || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expected Quantity</label>
                            <input name="Name" value={formData.expectedQuantity || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Actual Quantity</label>
                            <input name="Name" value={formData.actualQuantity || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Kilo</label>
                            <input name="Name" value={formData.totalKilo || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className = "mt-1">
                            <ModalCustomFormSelect
                                label="Delivery Status"
                                name="deliveryStatus"
                                options={deliveryStatusOptions}
                                currentValue={formData.deliveryStatus}
                                onSelect={handleInputChange}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                            <textarea name="remarks" rows="3" value={formData.remarks || ''} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200 resize-none" />
                        </div>
                    </div>

                    <div className="p-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline">Cancel</button>
                        <button onClick={() => onSave(formData)} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg shadow-blue-500/30">Update Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default EditReceivedItemsModal;
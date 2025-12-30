import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect'; 

// Define the categories for the dropdown
const TYPE_OPTIONS = [
    { value: 'Standard Items', label: 'UNPACK' },
    { value: 'Premium Items', label: 'VIP' },
    { value: 'Valuable Items', label: 'VACUUM' },
    { value: 'Other Items/Services', label: 'Other Items/Services' }
];

function AddItemModal({ isOpen, onClose, onAddItem }) {
    /* =======================
    ITEM FORM STATE
    ======================= */

    const [itemForm, setItemForm] = useState({
    brand: "",
    type: "",
    quantity: 0,
    unitPrice: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    });

    /* =======================
    AUTO TOTAL CALCULATION
    ======================= */

    useEffect(() => {
    const quantity = Number(itemForm.quantity) || 0;
    const unitPrice = Number(itemForm.unitPrice) || 0;
    const shipping = Number(itemForm.shipping) || 0;
    const discount = Number(itemForm.discount) || 0;

    setItemForm((prev) => ({
        ...prev,
        total: quantity * unitPrice + shipping - discount,
        }));
    }, [
    itemForm.quantity,
    itemForm.unitPrice,
    itemForm.shipping,
    itemForm.discount,
    ]);

    /* =======================
    MODAL GUARD
    ======================= */

    if (!isOpen) return null;

    /* =======================
    INPUT HANDLERS
    ======================= */

    // Standard input handler
    const handleItemChange = (e) => {
        const { name, value, type } = e.target;

        const parsedValue =
            type === "number" || name === "quantity" || name === "unitPrice"
            ? value === ""
                ? ""
                : parseFloat(value)
            : value;

        setItemForm((prev) => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    // Custom select handler
    const handleSelectChange = (value, name) => {
        setItemForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =======================
    SAVE HANDLER
    ======================= */

    const handleSave = (e) => {
        e.preventDefault();
        console.log("Saving item:", itemForm);
        const finalItem = {
            ...itemForm,
            quantity: Number(itemForm.quantity) || 0,
            unitPrice: Number(itemForm.unitPrice) || 0,
            shipping: Number(itemForm.shipping) || 0,
            discount: Number(itemForm.discount) || 0,
            total: Number(itemForm.total) || 0,
        };

        if (!finalItem.brand || !finalItem.type || finalItem.quantity <= 0) {
            alert("Please enter a brand, select a type, and enter a valid quantity.");
            return;
        }

        onAddItem(finalItem);

        setItemForm({
            brand: "",
            type: "",
            quantity: 0,
            unitPrice: 0,
            shipping: 0,
            discount: 0,
            total: 0,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
                <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add Product Item</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                    {/* Brand Input */}
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Brand</label>
                        <input 
                            type="text" id="brand" name="brand"
                            value={itemForm.brand}
                            onChange={handleItemChange}
                            className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Type Dropdown Select */}
                    <div>
                        <CustomFormSelect
                            label="Type"
                            name="type"
                            options={TYPE_OPTIONS}
                            initialValue={itemForm.type}
                            onSelect={handleSelectChange}
                            placeholder="Select item type..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label htmlFor="Shipping" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Shipping</label>
                            <input 
                                type="number" step="0.01" min="0" id="Shipping" name="shipping"
                                value={itemForm.shipping}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="Discount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Discount</label>
                            <input 
                                type="number" step="0.01" min="0" id="Discount" name="discount"
                                value={itemForm.discount}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity (KG)</label>
                            <input 
                                type="number" step="0.01" min="0" id="quantity" name="quantity"
                                value={itemForm.quantity}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="unitPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Unit Price</label>
                            <input 
                                type="number" step="0.01" min="0" id="unitPrice" name="unitPrice"
                                value={itemForm.unitPrice}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    

                    <div className="text-right pt-2">
                        <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Total:</span> 
                        <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">
                            {itemForm.total.toFixed(2)}
                        </span>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItemModal;
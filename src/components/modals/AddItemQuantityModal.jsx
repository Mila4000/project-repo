import React, { useState } from 'react';
import { X } from 'lucide-react'; 

function AddItemQuantityModal({ isOpen, onClose, onAddItem }) {
    
    // State to hold the item details
    const [itemForm, setItemForm] = useState({
        product_name: '',
        expected_quantity: '',
        quantity: '',
    });
    
    // --- 2. CONDITIONAL RETURN AFTER HOOKS ---
    if (!isOpen) {
        return null;
    }
    // ----------------------------------------

    const handleItemChange = (e) => {
        const { name, value, type } = e.target;
        
        // Handle numeric fields (Quantity)
        const newValue = (type === 'number' || name.includes('Quantity')) 
            ? (value === '' ? '' : parseFloat(value)) // Allow empty string, otherwise parse as float
            : value;

        setItemForm(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        const finalItem = {
            product_name: itemForm.product_name,
            expected_quantity: itemForm.expected_quantity,
            quantity: itemForm.quantity,
            unit_price: 0, // Default unit price
        };

        if (!finalItem.product_name || (finalItem.expected_quantity === '' && finalItem.quantity === '')) {
            alert("Please enter an Item Name and at least one quantity (Expected or Actual).");
            return;
        }

        onAddItem(finalItem);
        
        // Reset form for next item
        setItemForm({
            product_name: '',
            expected_quantity: '',
            quantity: '',
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center"
        >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                Add Product Item Manually
                            </h2>

                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                            </button>
                        </div>

                <form onSubmit={handleSave} className="space-y-4">
                    {/* Item Name Input */}
                    <div>
                        <label htmlFor="product_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Item Name
                        </label>
                        <input 
                            type="text" 
                            id="product_name" 
                            name="product_name"
                            value={itemForm.product_name}
                            onChange={handleItemChange}
                            className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {/* Expected Quantity Input */}
                        <div>
                            <label htmlFor="expected_quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Expected Quantity
                            </label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0"
                                id="expected_quantity" 
                                name="expected_quantity"
                                value={itemForm.expected_quantity}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                            />
                        </div>

                        {/* Actual Quantity Input */}
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Actual Quantity
                            </label>
                            <input 
                                type="number" 
                                step="0.01" 
                                min="0"
                                id="quantity" 
                                name="quantity"
                                value={itemForm.quantity}
                                onChange={handleItemChange}
                                className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Ensure the export name matches the import name in the main modal
export default AddItemQuantityModal;
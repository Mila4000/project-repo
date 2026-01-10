// AddSupplierModal.jsx

import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect';

const WarehouseOptions = [
    { warehouse: 'Saog' },
    { warehouse: 'Meycuayan' },
    { warehouse: 'Quezon City' },
    { warehouse: 'Bocaue' }
];

function AddCountingModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // --- 1. STATE FOR MAIN FORM FIELDS ---
    const [formValues, setFormValues] = useState({
        CountDate: '',
        Warehouse: '',
        remarks: '',
    });

    // --- 2. STATE FOR DYNAMIC ITEM ROWS ---
    const [items, setItems] = useState([
        // Initialize with one empty row
        { id: Date.now(), item: '', quantity: '' } 
    ]);
    
    // --- 3. HANDLERS FOR ITEM ROWS ---

    // Handler to Add a New Row
    const handleAddItem = () => {
        const newItem = {
            id: Date.now(), // Unique ID
            item: '',
            quantity: ''
        };
        setItems(prevItems => [...prevItems, newItem]);
    };

    // Handler to Update Input Fields within a row
    const handleItemInputChange = (id, field, value) => {
        setItems(prevItems => 
            prevItems.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // Handler to Remove a Row
    const handleRemoveItem = (id) => {
        setItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    // --- 4. HANDLERS FOR MAIN FORM FIELDS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;


        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async(e) => {
        e.preventDefault();
        
        // Final structure to send: main form data + item list
        const finalData = {
            ...formValues,
            itemsToCount: items.filter(item => item.item.trim() !== '' || item.quantity.trim() !== '')
        };
        
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/inventory`,
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
                }
            ); 
            if (!response.ok) {
                const errText = await response.text();
                console.error("Backend error:", errText);
                throw new Error("Failed to save purchase");
            }
        } catch (error) {
            console.error("Adding count failed", error);
        }
        setFormValues({ CountDate: '', Warehouse: '', remarks: '' });
        setItems([{ id: Date.now(), item: '', quantity: '' }]);
        onClose();
    };

    const WarehouseOption = WarehouseOptions.map(d => ({ value: d.warehouse, label: d.warehouse }));

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div 
                className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col" // <--- KEY CHANGES
                onClick={e => e.stopPropagation()}
            >

                <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Add Counting
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto flex-grow pr-2 custom-scrollbar"> 
                    
                    {/* Main form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="w-full">
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Count Date
                            </label>
                            <div className="relative"> 
                                <input
                                    type="date"
                                    id="date"
                                    name="CountDate" 
                                    value={formValues.CountDate} 
                                    onChange={handleInputChange} 
                                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-300
                                                bg-white text-slate-700
                                                dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 
                                                focus:outline-none focus:border-blue-500 transition 
                                                appearance-none date-input-no-icon pr-10" 
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        viewBox="0 0 24 24" fill="none" 
                                        stroke="currentColor" strokeWidth="2" 
                                        strokeLinecap="round" strokeLinejoin="round" 
                                        className="w-5 h-5 text-slate-800 dark:text-slate-300"> 
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                                        <line x1="16" x2="16" y1="2" y2="6"/>
                                        <line x1="8" x2="8" y1="2" y2="6"/>
                                        <line x1="3" x2="21" y1="10" y2="10"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Warehouse Select */}
                        <CustomFormSelect
                            label="Warehouse"
                            name="Warehouse" 
                            options={WarehouseOption}
                            initialValue={formValues.Warehouse}
                            onSelect={(selected) => {handleInputChange({ target: { name: 'Warehouse', value: selected?.value ?? selected}});}}
                        /> 
                    </div>

                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Remarks
                        </label>
                        <textarea
                            id="remarks"
                            name="remarks"
                            rows="3"
                            value={formValues.remarks}
                            onChange={handleInputChange} 
                            className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white resize-none text-slate-700 dark:text-slate-200"

                        />
                    </div>


                    {/* ITEMS TO COUNT SECTION (DYNAMIC TABLE)  */}
                    <div className="pb-3">
                        <div className="flex items-center justify-between pb-4 mb-1 border-b border-slate-300 dark:border-slate-600">
                            <h1 className="text-[#535353] dark:text-white text-xl font-bold">Items to Count</h1>
                        </div>

                        <table className="w-full">
                            <tbody>
                                {/* DYNAMIC ROWS */}
                                {items.map((row, index) => (
                                    <tr 
                                        key={row.id} 
                                        className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        {/* ITEM INPUT FIELD */}
                                        <td className="p-2 py-3 text-sm text-slate-700 dark:text-slate-200 w-1/2">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-md font-medium min-w-[50px]">Item:</span>
                                                <input 
                                                    type="text" 
                                                    value={row.item}
                                                    onChange={(e) => handleItemInputChange(row.id, 'item', e.target.value)}
                                                    placeholder={`Item ${index + 1}`}
                                                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-xs text-slate-700 dark:text-slate-200 focus:border-blue-500" 
                                                />
                                            </div>
                                        </td>
                                        
                                        {/* QUANTITY INPUT FIELD */}
                                        <td className="p-2 py-3 text-sm text-slate-700 dark:text-slate-200 w-1/3">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-md font-medium min-w-[80px]">Quantity: </span>
                                                <input 
                                                    type="number" 
                                                    value={row.quantity}
                                                    onChange={(e) => handleItemInputChange(row.id, 'quantity', e.target.value)}
                                                    className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 shadow-xs text-slate-700 dark:text-slate-200 focus:border-blue-500" 
                                                />
                                            </div>
                                        </td>
                                        
                                        {/* REMOVE BUTTON */}
                                        <td className="p-2 py-3 text-center text-sm text-slate-700 dark:text-slate-200 w-auto">
                                            {items.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveItem(row.id)}
                                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 p-1 rounded transition-colors cursor-pointer"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                
                                {/* Placeholder for empty state */}
                                {items.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-slate-500 dark:text-slate-400 italic">
                                            Click "New Item" to start adding items.
                                        </td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>

                        {/* NEW ITEM BUTTON - Calls handleAddItem */}
                        <div className="flex items-center justify-center ">
                            <div className="flex items-center justify-center mt-3 w-80 rounded-md hover:bg-slate-100/50 border border-slate-300 dark:border-slate-600/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 cursor-pointer transition-all">
                                <button
                                    type="button"
                                    onClick={handleAddItem} 
                                    className="flex items-center space-x-2 py-2 px-4 text-slate-600 dark:text-white rounded-lg cursor-pointer transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">New Item</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* FOOTER: Fixed (flex-shrink-0) */}
                <div className="pt-8 flex justify-end space-x-3 flex-shrink-0 mt-auto">
                    <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" onClick={handleSubmit} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                        Save Counting
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCountingModal;
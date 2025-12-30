import React, { useState } from 'react';
import { Plus, Trash2, X, Minus } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect'; 
import AddItemQuantityModal from './AddItemQuantityModal'; // Renamed modal

// --- DUMMY DATA ---
const SupplierData = [
    { supplier: 'Earl Meats Inc.' },
    { supplier: 'Javier Meats' },
    { supplier: 'Betez Trading' }
];

const ReceivedItemsData = [
    {
        POnumber: 'PO-123456',
        transaction_date: 'Sep 21, 2025',
        SupplierName: 'Earl Meats Inc.',
        ContactNumber: '09123456789',
        Items: [
            { ItemName: 'Chicken Thighs', ExpectedQuantity: 80 },
            { ItemName: 'Frozen Salmon', ExpectedQuantity: 30 },
        ]
    },
    {
        POnumber: 'PO-135790',
        transaction_date: 'Sep 20, 2025',
        SupplierName: 'Javier Meats',
        ContactNumber: '09123456789',
        Items: [
            { ItemName: 'Fresh Beef', ExpectedQuantity: 90 },
        ]
    },
    {
        POnumber: 'PO-24681',
        transaction_date: 'Sep 19, 2025',
        SupplierName: 'Betez Trading',
        ContactNumber: '09989012345',
        Items: [
            { ItemName: 'Pork Chop', ExpectedQuantity: 100 },
            { ItemName: 'Pork Belly', ExpectedQuantity: 50 },
        ]
    }
];


// Helper function to generate a unique ID for new items
let nextItemId = Date.now();
const generateId = () => nextItemId++;

// --- QUANTITY VALIDATION AND CLAMPING FUNCTION ---
// This function enforces the min/max limits for manual input and numeric consistency.
const clampQuantity = (value, min, max) => {
    // 1. Handle empty string or non-numeric input
    if (value === '' || isNaN(parseFloat(value))) {
        return min; // Default to the minimum valid quantity
    }
    
    let numericValue = parseFloat(value);
    
    // 2. Clamp the value
    if (numericValue < min) {
        return min;
    } else if (numericValue > max) {
        return max;
    }
    
    return numericValue;
};


function AddReceivedItemsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // --- STATE MANAGEMENT ---
    const [formValues, setFormValues] = useState({
        POnumber: '',
        transaction_date: '',
        SupplierName: '', 
        ContactNumber: '', 
    });
    
    const [receivedItems, setReceivedItems] = useState([]);

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    
    const handleOpenItemModal = () => setIsItemModalOpen(true);
    const handleCloseItemModal = () => setIsItemModalOpen(false);


    // --- Core Logic: PO Number Selection & Auto-fill ---

    const handlePOSelect = (poNumber) => {
        const poData = ReceivedItemsData.find(d => d.POnumber === poNumber);

        if (poData) {
            setFormValues(prev => ({
                ...prev,
                POnumber: poNumber,
                transaction_date: poData.transaction_date,
                SupplierName: poData.SupplierName,
                ContactNumber: poData.ContactNumber,
            }));

            const initialItems = poData.Items.map(item => ({
                id: generateId(),
                ItemName: item.ItemName,
                ExpectedQuantity: parseFloat(item.ExpectedQuantity) || 0,
                ActualQuantity: '',
            }));
            setReceivedItems(initialItems);
        } else {
             setFormValues(prev => ({
                ...prev,
                POnumber: poNumber,
                transaction_date: '',
                SupplierName: '',
                ContactNumber: '',
            }));
            setReceivedItems([]);
        }
    };


    // --- ITEM HANDLERS ---
    
    const handleManualAddItem = (newItem) => {
        const itemWithId = {
            ...newItem,
            id: generateId(),
            ExpectedQuantity: parseFloat(newItem.ExpectedQuantity) || '', 
            ActualQuantity: parseFloat(newItem.ActualQuantity) || '',
        };
        setReceivedItems(prev => [...prev, itemWithId]);
        handleCloseItemModal();
    };


    // Handler for updating Actual Quantity directly in the table (Manual Input/Typing)
    const handleActualQuantityChange = (id, value) => {
        // This handler updates the state as the user types
        setReceivedItems(prev => prev.map(item => 
            item.id === id ? { ...item, ActualQuantity: value } : item
        ));
    };

    // Handler to apply validation when the user leaves the input field (onBlur)
    const handleQuantityBlur = (id, value) => {
        const min = 1; 
        const max = 999;
        
        // Clamp the final input value
        const validatedValue = clampQuantity(value, min, max);

        setReceivedItems(prev => prev.map(item => 
            item.id === id ? { ...item, ActualQuantity: validatedValue } : item
        ));
    };


    // Handler for increment/decrement button clicks
    const handleQuantityButtonClick = (itemId, currentQuantity, direction) => {
        const min = 1;
        const max = 999;
        const step = 1;
        
        // Use the clamped value of the current quantity for calculation base
        let baseQuantity = clampQuantity(currentQuantity, min, max);

        // Apply the change
        let newQuantity = baseQuantity + (direction * step);

        // Re-clamp the final value
        const finalQuantity = clampQuantity(newQuantity, min, max);

        // Update the state
        setReceivedItems(prev => prev.map(item => 
            item.id === itemId ? { ...item, ActualQuantity: finalQuantity } : item
        ));
    };

    // Handler to remove an item from the table
    const handleRemoveItem = (id) => {
        setReceivedItems(prev => prev.filter(item => item.id !== id));
    };
    
    // --- END ITEM HANDLERS ---


    // Universal Form Input Change Handler
    const handleInputChange = (value, name) => {
        if (name === 'POnumber') {
            handlePOSelect(value);
        }
        
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formValues.POnumber) {
            alert("Please select a valid PO Number.");
            return;
        }

        console.log("New Received Item Data:", { ...formValues, receivedItems });
        
        setFormValues({ POnumber: '', transaction_date: '', SupplierName: '', ContactNumber: '' });
        setReceivedItems([]); 
        onClose();
    };


    const poOptions = ReceivedItemsData.map(d => ({ value: d.POnumber, label: d.POnumber }));


    return (
        <>
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[40] flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                    onClick={e => e.stopPropagation()}>

                    <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                Add Received Items
                            </h2>

                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                            </button>
                        </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* PO Number Select */}
                            <CustomFormSelect
                                label="PO Number"
                                name="POnumber"
                                options={poOptions}
                                initialValue={formValues.POnumber}
                                onSelect={handleInputChange} 
                                placeholder="Select PO" 
                                required
                            />

                            {/* Transaction Date (Autofilled) */}
                            <div>
                                <label htmlFor="transaction_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Date</label>
                                <input type="text" id="transaction_date" name="transaction_date" value={formValues.transaction_date} 
                                    readOnly 
                                    className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 shadow-xs text-slate-700 dark:text-slate-200 cursor-not-allowed" 
                                    required 
                                />
                            </div>

                            {/* SUPPLIER NAME (Autofilled Text Field) */}
                            <div>
                                <label htmlFor="SupplierName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier Name</label>
                                <input type="text" id="SupplierName" name="SupplierName" value={formValues.SupplierName} 
                                    readOnly 
                                    className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 shadow-xs text-slate-700 dark:text-slate-200 cursor-not-allowed" 
                                    required 
                                />
                            </div>
                            
                            {/* Contact No. (Autofilled) */}
                            <div>
                                <label htmlFor="ContactNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact Number</label>
                                <input type="text" id="ContactNumber" name="ContactNumber" value={formValues.ContactNumber} 
                                    readOnly 
                                    className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/70 shadow-xs text-slate-700 dark:text-slate-200 cursor-not-allowed" 
                                />
                            </div>
                        </div>
                        
                        {/* PRODUCT LIST TABLE SECTION */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-[#535353] dark:text-white text-xl font-bold">Product Details</h1>

                                <button
                                    type="button"
                                    onClick={handleOpenItemModal}
                                    className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Item</span>
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Expected Quantity</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actual Quantity</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* DYNAMIC ROWS MAPPING OVER receivedItems */}
                                    {receivedItems.length > 0 ? (
                                        receivedItems.map((item) => (
                                            <tr 
                                                key={item.id} 
                                                className = "border-b border-slate-300 dark:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.ItemName}</td>
                                                <td className="p-4 text-sm text-center text-slate-700 dark:text-slate-200">{item.ExpectedQuantity}</td>
                                                <td className="p-3 text-center text-sm text-slate-700 dark:text-slate-200 w-[150px]">
                                                    {/* <div className="relative flex items-center max-w-[8rem] border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md mx-auto">
                                                        
                                                        <button 
                                                            type="button" 
                                                            id="decrement-button" 
                                                            onClick={() => handleQuantityButtonClick(item.id, item.ActualQuantity, -1)}
                                                            className="hover:bg-slate-100/50 dark:hover:bg-slate-500/30 rounded-l-md cursor-pointer border-r border-slate-300 dark:border-slate-600 box-border font-medium text-slate-800 dark:text-slate-300 leading-5 rounded-s-base text-sm px-3 focus:outline-none h-10"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <input 
                                                            type="text" 
                                                            id={`quantity-input-${item.id}`}
                                                            step="1" 
                                                            data-input-counter-min="1" 
                                                            data-input-counter-max="999" 
                                                            value={item.ActualQuantity} 
                                                            onChange={(e) => handleActualQuantityChange(item.id, e.target.value)} 
                                                            onBlur={(e) => handleQuantityBlur(item.id, e.target.value)}
                                                            className=" border-x-0 h-10 text-center w-full py-2.5 text-slate-800 dark:text-slate-300 focus:outline-none" 
                                                            required
                                                        />
                                                        
                                                        <button 
                                                            type="button" 
                                                            id="increment-button" 
                                                            onClick={() => handleQuantityButtonClick(item.id, item.ActualQuantity, 1)}
                                                            className="hover:bg-slate-100/50 dark:hover:bg-slate-500/30 rounded-r-md cursor-pointer border-l border-slate-300 dark:border-slate-600 box-border font-medium text-slate-800 dark:text-slate-300 leading-5 rounded-s-base text-sm px-3 focus:outline-none h-10"
                                                        >
                                                            <Plus className="w-4 h-4"/>
                                                        </button>
                                                    </div> */}

                                                    <input 
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.ActualQuantity}
                                                        onChange={(e) => handleActualQuantityChange(item.id, e.target.value)}
                                                        className="w-full px-2 py-1 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-center"
                                                        required
                                                    />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                                                        aria-label={`Remove item ${item.ItemName}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                                            <td colSpan="4" className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 italic">
                                                Select a PO Number to load items, or click "Add Item" to add manually.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                                Save Received Items
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* The nested AddItemQuantityModal component */}
            <AddItemQuantityModal 
                isOpen={isItemModalOpen} 
                onClose={handleCloseItemModal} 
                onAddItem={handleManualAddItem} 
            />
        </>
    );
}

export default AddReceivedItemsModal;
import React, { useState, useEffect, act } from 'react';
import { Plus, Trash2, X, Minus } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect'; 
import AddItemQuantityModal from './AddItemQuantityModal'; // Renamed modal

// --- DUMMY DATA ---
/* const SupplierData = [
    { supplier: 'Earl Meats Inc.' },
    { supplier: 'Javier Meats' },
    { supplier: 'Betez Trading' }
]; */

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


function AddReceivedItemsModal({ isOpen, onClose,  onAddItem }) {


    /* =========================
        STATE MANAGEMENT
    ========================= */
    const [formValues, setFormValues] = useState({
    POnumber: '',
    transaction_date: '',
    SupplierName: '',
    ContactNumber: '',
    });

    const [receivedOrders, setReceivedOrders] = useState([]);   // ALL fetched items
    const [lineItems, setLineItems] = useState([]);             // Selected PO items
    const [newItem, setNewItem] = useState([]);                 // Manually added items
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);


    /* =========================
    MODAL HANDLERS
    ========================= */
    const handleOpenItemModal  = () => setIsItemModalOpen(true);
    const handleCloseItemModal = () => setIsItemModalOpen(false);


    /* =========================
    DATA FETCHING
    ========================= */
    const fetchItems = async () => {
    try {
        const res  = await fetch(`${import.meta.env.VITE_API_URL}/received-items`);
        const data = await res.json();

        const normalized = data.map(item => ({
        id: item.id,
        purchased_order_id: item.purchased_order_id,
        unit_price: item.unit_price,

        po_number: item.purchased_order.po,
        product_name: item.product_name,

        expected_quantity: item.expected_quantity ?? 0,
        quantity: item.quantity ?? '',

        SupplierName: item.purchased_order.supplier.businessname,
        ContactNumber: item.purchased_order.supplier.contactno,
        transaction_date: item.purchased_order.transaction_date,
        }));

        setReceivedOrders(normalized);
    } catch (err) {
        console.error("Failed to fetch received items", err);
    }
    };

    useEffect(() => {
    fetchItems();
    }, []);


    /* =========================
    PO SELECTION & AUTO-FILL
    ========================= */
    const handlePOSelect = (poNumber) => {
    const poItems = receivedOrders.filter(
        item => item.po_number === poNumber
    );

    if (!poItems.length) return;

    const first = poItems[0];

    setFormValues({
        POnumber: poNumber,
        transaction_date: first.transaction_date,
        SupplierName: first.SupplierName,
        ContactNumber: first.ContactNumber,
    });

    setLineItems(
        poItems.map(item => ({
        id: item.id,
        purchased_order_id: item.purchased_order_id,
        unit_price: item.unit_price,
        product_name: item.product_name,
        expected_quantity: item.expected_quantity,
        quantity: item.quantity,
        }))
    );
    };


    /* =========================
    ITEM HANDLERS
    ========================= */
    const handleManualAddItem = (item) => {
    const formattedItem = {
        ...item,
        expected_quantity: Number(item.expected_quantity) || 0,
        quantity: Number(item.quantity) || 0,
        unit_price: Number(item.unit_price) || 0,
    };

    setNewItem(prev => [...prev, formattedItem]);
    handleCloseItemModal();
    };

    // Update quantity while typing (existing items)
    const handleActualQuantityChange = (id, value) => {
    setLineItems(prev =>
        prev.map(item =>
        item.id === id ? { ...item, quantity: value } : item
        )
    );
    };

    // Update quantity for newly added items
    const handleNewItemQuantityChange = (index, value) => {
    setNewItem(prev =>
        prev.map((item, i) =>
        i === index ? { ...item, quantity: value } : item
        )
    );
    };

    // Validate quantity on blur
    const handleQuantityBlur = (id, value) => {
    const validated = clampQuantity(value, 1, 999);

    setLineItems(prev =>
        prev.map(item =>
        item.id === id ? { ...item, quantity: validated } : item
        )
    );
    };

    // Increment / Decrement buttons
    const handleQuantityButtonClick = (id, current, direction) => {
    const base  = clampQuantity(current, 1, 999);
    const next  = clampQuantity(base + direction, 1, 999);

    setLineItems(prev =>
        prev.map(item =>
        item.id === id ? { ...item, quantity: next } : item
        )
    );
    };

    // Remove item from table
    const handleRemoveItem = (id) => {
    setLineItems(prev => prev.filter(item => item.id !== id));
    };


    /* =========================
    FORM HANDLERS
    ========================= */
    const handleInputChange = (value, name) => {
    if (name === 'POnumber') {
        handlePOSelect(value);
    }

    setFormValues(prev => ({
        ...prev,
        [name]: value,
    }));
    };


    /* =========================
    SUBMIT HANDLER
    ========================= */
    const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        ...formValues,
        items: lineItems,
        newItem,
    };


    try {
        const response = await fetch(
        `${import.meta.env.VITE_API_URL}/received-items`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
        );

        if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
        }

        const savedData = await response.json();
        onAddItem(savedData);
        onClose();
    } catch (err) {
        console.error("Failed to save received items", err);
    }
    };


    /* =========================
    DERIVED VALUES
    ========================= */
    if (!isOpen) return null;

    const poOptions = [
    ...new Set(receivedOrders.map(o => o.po_number))
    ].map(po => ({
    value: po,
    label: po,
    }));



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

                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Expected Quantity</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actual Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* PO ITEMS */}
                                    {lineItems.map(item => (
                                        <tr key={`po-${item.id}`}>
                                        <td className="p-4">{item.product_name}</td>

                                        <td className="p-4 text-center">
                                            {item.expected_quantity}
                                        </td>

                                        <td className="p-3 text-center">
                                            <input
                                            type="number"
                                            min="0"
                                            value={item.quantity}
                                            onChange={e =>
                                                handleActualQuantityChange(item.id, Number(e.target.value))
                                            }
                                            className="w-full text-center rounded-md border"
                                            />
                                        </td>
                                        </tr>
                                    ))}

                                    {/* EMPTY STATE */}
                                    {lineItems.length === 0 && (
                                        <tr>
                                        <td
                                            colSpan="4"
                                            className="p-4 text-center text-sm text-slate-500 italic"
                                        >
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
import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect'; 
import AddItemModal from './AddItemModal'; 


const CustomerData = [
    { customer: 'Sarah Jane' },
    { customer: 'Joseph Karl' },
    { customer: 'Junnie B. Oy' }
];


function CreateInvoiceModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // --- State for Form Values ---
    const [formValues, setFormValues] = useState({
        PONumber: '',
        customer: null,
        transaction_date: '',
        remarks: '',
    });

    // --- NEW STATE FOR ITEMS AND ITEM MODAL ---
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);

    const [purchaseItems, setPurchaseItems] = useState([]);

    // --- Handlers ---
    const handleInputChange = (value, name) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handler to open the Add Item modal
    const handleOpenItemModal = () => setIsItemModalOpen(true);
    // Handler to close the Add Item modal
    const handleCloseItemModal = () => setIsItemModalOpen(false);

    // Handler to receive new item data from the AddItemModal and add it to the table
    const handleAddItem = (newItem) => {
        // Add a unique ID to the new item
        const itemWithId = {
            ...newItem,
            id: Date.now() // Simple unique ID
        };
        setPurchaseItems(prev => [...prev, itemWithId]);
        handleCloseItemModal();
    };

    // Handler to remove an item from the table
    const handleRemoveItem = (id) => {
        setPurchaseItems(prev => prev.filter(item => item.id !== id));
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        onClose();
    };

    // File upload state and handler
    const [receiptFileName, setReceiptFileName] = useState('No file chosen');
    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const fileName = files[0].name;
            setReceiptFileName(fileName);
        } else {
            setReceiptFileName('No file chosen');
        }
    };


    // --- Data Transformation ---
    const customerOptions = CustomerData.map(d => ({ value: d.customer, label: d.customer }));
    
    // LOGIC: Categorized Subtotals
    const subtotals = purchaseItems.reduce((acc, item) => {
        const amount = parseFloat(item.total) || 0;
        if (item.type === 'Standard Items') acc.standard += amount;
        else if (item.type === 'Premium Items') acc.premium += amount;
        else acc.others += amount;
        
        acc.grandTotal += amount;
        return acc;
    }, { standard: 0, premium: 0, others: 0, grandTotal: 0 });

    // Mapping back to your existing variable names for the design
    const merchandiseSubtotal = subtotals.standard; 
    const premiumSubtotal = subtotals.premium;
    const othersSubtotal = subtotals.others;
    const totalPayment = subtotals.grandTotal;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/20 dark:bg-black/20 z-40 flex items-center justify-center overflow-y-auto"
            >
                {/* Modal Content Box */}
                <div className="flex flex-col h-full max-h-[95vh] bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-5xl mx-4" 
                    onClick={e => e.stopPropagation()}>
                    
                    <div className = "w-full flex items-center justify-between mb-5 pb-4 border-b border-slate-300 dark:border-slate-700 flex-shrink-0">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Create Invoice
                        </h2>

                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>
                    

                    <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto space-y-8 pr-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                                <label htmlFor="PONumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    PO No.
                                </label>
                                <input
                                    type="text" 
                                    id="PONumber" 
                                    className="w-full text-slate-700 
                                    dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md 
                                    border border-slate-300 dark:border-slate-600 bg-white 
                                    dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 
                                    dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white cursor-not-allowed"
                                    readOnly
                                />
                            </div>
                            
                            {/* SUPPLIER FIELD */}
                            <CustomFormSelect
                                label="Customer"
                                name="customer"
                                options={customerOptions}
                                initialValue={formValues.customer}
                                onSelect={handleInputChange}
                                placeholder="" 
                            />

                            <div className="w-full">
                                <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Transaction Date
                                </label>
                                <div className="relative"> 
                                    <input
                                        type="date"
                                        id="date"
                                        name="transaction_date" 
                                        value={formValues.transaction_date}
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
                            

                            <div>
                                <label htmlFor="ContactNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Contact Number
                                </label>
                                <input 
                                    type="text" 
                                    id="ContactNumber"
                                    className="w-full text-slate-700 
                                    dark:text-slate-200 mt-1 px-3 py-1.5 h-9 
                                    rounded-md border border-slate-300 dark:border-slate-600 
                                    bg-white dark:bg-slate-700 shadow-xs focus:outline-none 
                                    focus:border-blue-500 dark:focus:border-blue-500 
                                    focus:caret-slate-500 dark:focus:caret-white"
                                />
                            </div>

                            <div className = "col-span-2">
                                <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                                <input type = "text" id="Address" name="Address" rows="2" value={formValues.Address} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200 resize-none" />
                            </div>
                            
                        </div>

                        {/* Product List Table Section */}
                        <div className="overflow-x-auto">
                            <div className="flex items-center justify-between mb-2">
                                <h1 className="text-[#535353] dark:text-white text-xl font-bold">Product List</h1>
                                {/* BUTTON: Triggering the AddItemModal */}
                                <button
                                    type="button"
                                    onClick={handleOpenItemModal} // <-- NEW HANDLER
                                    className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg cursor-pointer hover:shadow-lg transition-all">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Item</span>
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Brand</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Type</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Quantity (KG)</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Unit Price</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Total</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* DYNAMIC ROWS MAPPING OVER purchaseItems */}
                                    {purchaseItems.length > 0 ? (
                                        purchaseItems.map((item, index) => (
                                            <tr 
                                                key={item.id} 
                                                className = "border-b border-slate-300 dark:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                            >
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.brand}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.type}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.quantity}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.unitPrice.toFixed(2)}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{(item.total).toFixed(2)}</td>
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveItem(item.id)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                                                        aria-label={`Remove item ${item.brand}`}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                                            <td colSpan="6" className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 italic">
                                                No products added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">

                                {/* FILE UPLOAD FIELD */}
                                <label className="block mb-3 text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="file_input">Computation</label>
                                <div className="relative flex rounded-lg overflow-hidden w-full max-w-xs bg-white border border-slate-300 dark:bg-slate-700 dark:border-slate-600 hover:border-blue-400 shadow-xs">
                                    <span className="bg-slate-400/20 dark:bg-slate-600/90 text-slate-600/80 dark:text-slate-400/80 px-3 py-2 text-sm font-medium flex items-center select-none cursor-pointer">
                                        Choose File
                                    </span>
                                    
                                    <span className="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm flex items-center truncate overflow-hidden whitespace-nowrap min-w-0">
                                        {receiptFileName}
                                    </span>
                                    
                                    <input type="file" id="file_input" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange}/>
                                </div>
                            </div>
                            
                            {/* Payment Details */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Details</label>
                                <div className = "w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                                    <table className="w-full">
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Standard Items</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Premium Items</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Other Items/Services</td>
                                            </tr>
                                            <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200">Merchandise Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{merchandiseSubtotal.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{premiumSubtotal.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{othersSubtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200">Shipping Subtotal</td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200">Item Discount Subtotal</td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 pb-6 text-xs text-slate-700 dark:text-slate-200">Order Discount</td>
                                                <td className="py-3 px-4 pb-6 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                                <td className="py-3 px-4 pb-6 text-xs text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">0.00</td>
                                            </tr>
                                            <tr className="bg-slate-200/50 dark:bg-slate-700/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-bold dark:font-bold"></td>
                                                <td colSpan={3} className="py-3 px-4 text-md text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">
                                                    <span className  = "mr-2 text-lg font-normal">Subtotal: </span> <span className = "text-lg ">{totalPayment.toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </form>

                        {/* Action Buttons */}
                        <div className="pt-4 mt-4 border-t border-slate-300 dark:border-slate-700 flex justify-end space-x-3 flex-shrink-0">
                            <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                                Save Purchase
                            </button>
                        </div>
                </div>
            </div>

            <AddItemModal 
                isOpen={isItemModalOpen} 
                onClose={handleCloseItemModal} 
                onAddItem={handleAddItem} 
            />
        </>
    );
}

export default CreateInvoiceModal;
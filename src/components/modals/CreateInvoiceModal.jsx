import React, { useState,useEffect,useMemo} from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect'; 
import AddItemModal from './AddItemModal'; 
import { fetchSIPreview  } from "../../utils/previewOrder";
import { calculatePurchaseTotals } from "../../utils/paymentCalculator";
import { uploadComputation,uploadProofOfPayment } from '../../utils/storageHelpers';
import AddCustomerModal from '../../components/modals/AddCustomerModal';

const CustomerData = [
    { customer: 'Sarah Jane' },
    { customer: 'Joseph Karl' },
    { customer: 'Junnie B. Oy' }
];


function CreateInvoiceModal({ isOpen, onClose, onAddSales,itemList}) {
    const getToday = () => {
        return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    };
    const [SIPreview, setSIPreview] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    // File upload state and handler
    const [receiptFile, setReceiptFile] = useState(null);
    const [receiptFileName, setReceiptFileName] = useState('No file chosen');
    const [computationFile, setComputationFile] = useState(null);
    const [computationFileName, setComputationFileName] = useState('No file chosen');

    const [purchaseItems, setPurchaseItems] = useState([]);
    const [formValues, setFormValues] = useState({
        PONumber: '',
        customer: null,       
        transaction_date: getToday(),
        remarks: '',
        contactno: '',       
        address: '',    
    });
    useEffect(() => {
    const fetchCustomers = async () => {
        try {
            setLoadingCustomers(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`); // <-- your endpoint
            const data = await res.json();
            setCustomers(data);

        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoadingCustomers(false);
        }
        };
        fetchCustomers();
    }, [isAddModalOpen]);

    useEffect(() => {
    if (!isOpen) return;

    const loadPreview = async () => {
        const preview = await fetchSIPreview(formValues.transaction_date);
        setSIPreview(preview);
    };

    loadPreview();
    }, [isOpen, formValues.transaction_date]);

    const paymentTotals = useMemo(() => {
        return calculatePurchaseTotals(purchaseItems);
    }, [purchaseItems]);

    const {
        merchandiseSubtotal,
        shippingSubtotal,
        discountSubtotal,
        totalPayment
    } = paymentTotals;


    // --- Handlers ---
    const handleInputChange = (value, name) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };
    // Handler to open the Add Customer modal
    const handleOpenCustomerModal = () => setIsAddModalOpen(true);
    // Handler to close the Add Customer modal
    const handleCloseCustomerModal = () => setIsAddModalOpen(false);
    // Handler to open the Add Item modal
    const handleOpenItemModal = () => setIsItemModalOpen(true);
    // Handler to close the Add Item modal
    const handleCloseItemModal = () => setIsItemModalOpen(false);

    // Handler to receive new item data from the AddItemModal and add it to the table
    const handleAddItem = (newItem) => {
        setPurchaseItems((prev) => [
        ...prev,
        { ...newItem },
        ]);
        handleCloseItemModal();
    };

    // Handler to remove an item from the table
    const handleRemoveItem = (id) => {
        setPurchaseItems(prev => prev.filter(item => item.id !== id));
    };
    
    const handleFormSubmit = async(e) => {
        e.preventDefault();
        
        if (!purchaseItems.length) {
            alert("Please add at least one item before submitting the purchase order.");
            return;
        }

        if (!formValues.customer || !formValues.transaction_date) {
            alert("Please complete all required fields.");
            return;
        }
        try {
            const newSales = {
              customer: formValues.customer,
              transaction_date: new Date(formValues.transaction_date).toISOString(),
              items: purchaseItems.map(item => ({
                id: item.id,
                name: item.brand,
                type: item.type,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                discount:Number(item.discount),
                shipping:Number(item.shipping),
        
              })),
                // ✅ PAYMENT TOTALS
              merchandise_subtotal: Number(merchandiseSubtotal),
              shipping_subtotal: Number(shippingSubtotal)||0,
              discount_subtotal: Number(discountSubtotal)||0,
              total_payment: Number(totalPayment)||0,
              
              approval_status: "Pending",
              delivery_status: "Order Placed",
              payment_status: "Unpaid",
            };
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sales-invoice`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newSales),
            });
        
            if (!response.ok) {
              const errorPayload = await response.json();
              throw new Error(errorPayload?.message || "Failed to save sales");
            }
        
            const savedSales = await response.json();
            // 2️⃣ UPLOAD RECEIPT (OPTIONAL)
            if (receiptFile || computationFile) {
                const computation = await uploadComputation(receiptFile, savedSales.si);
                const receiptPath = await uploadProofOfPayment(receiptFile, savedSales.si);
                // 3️⃣ UPDATE PURCHASE WITH RECEIPT PATH
                await fetch(`${import.meta.env.VITE_API_URL}/api/sales-invoice/${savedSales.id}/uploads`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receipt_url: receiptPath, computation_url: computation}),
                });
            }
            
            onAddSales(savedSales);
            handleClose();
        
          } catch (err) {
            console.error("sales submission error:", err);

            alert(
                err?.message ||
                "An unexpected error occurred while saving the sales invoice."
            );
          }
    };
    const resetForm = () => {
        setFormValues({
        PONumber: "",
        supplier: null,
        transaction_date: getToday(),
        delivery_date: getToday(),
        warehouse: null,
        remarks: "",
        });

        setPurchaseItems([]);
        setReceiptFileName("No file chosen");
    };
    const handleClose = () => {
        resetForm();
        onClose(); // this is the parent's closeModal()
    };


    const handleComputationFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setComputationFile(file);          // ✅ File object
            setComputationFileName(file.name); // UI only
        } else {
            setComputationFile(null);
            setComputationFileName("No file chosen");
        }
    };
    const handlePaymentFileChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setReceiptFile(file);          // ✅ File object
            setReceiptFileName(file.name); // UI only
        } else {
            setReceiptFile(null);
            setReceiptFileName("No file chosen");
        }
    };


    // --- Data Transformation ---
    const customerOptions = customers.map(c => ({
        value: c.id ?? c.id,
        label: c.customer ?? c.name,
    }));
    const handleCustomerSelect = (selectedValue, name) => {
        const selectedCustomer = customers.find(
            c => c.id === selectedValue
        );

        setFormValues(prev => ({
            ...prev,
            customer: selectedValue,
            contactno: selectedCustomer?.contactno || '',
            address: selectedCustomer?.address || '',   // ✅ auto-fill
        }));
    };
    // LOGIC: Categorized Subtotals
    const subtotals = purchaseItems.reduce((acc, item) => {
        const amount = parseFloat(item.total) || 0;
        const shipping = parseFloat(item.shipping) || 0;
        const discount = parseFloat(item.discount) || 0;

        let category;

        if (item.type === 'UNPACK' || item.type === 'Trading Items') {
            category = 'standard';
        } else if (item.type === 'VIP' || item.type === 'Commissary Items') {
            category = 'premium';
        } else {
            category = 'others';
        }

        acc[category].subtotal += amount;
        acc[category].shipping += shipping;
        acc[category].discount += discount;

        acc.grand.subtotal += amount;
        acc.grand.shipping += shipping;
        acc.grand.discount += discount;

        return acc;
    }, {
        standard: { subtotal: 0, shipping: 0, discount: 0 },
        premium: { subtotal: 0, shipping: 0, discount: 0 },
        others: { subtotal: 0, shipping: 0, discount: 0 },
        grand: { subtotal: 0, shipping: 0, discount: 0 }
    });
    const standardSubtotal = subtotals.standard.subtotal;
    const standardShipping = subtotals.standard.shipping;
    const standardDiscount = subtotals.standard.discount;

    const premiumSubtotal = subtotals.premium.subtotal;
    const premiumShipping = subtotals.premium.shipping;
    const premiumDiscount = subtotals.premium.discount;

    const othersSubtotal = subtotals.others.subtotal;
    const othersShipping = subtotals.others.shipping;
    const othersDiscount = subtotals.others.discount;

    const grandTotal = subtotals.grand.subtotal;
    const grandShipping = subtotals.grand.shipping;
    const grandDiscount = subtotals.grand.discount;

    // Optional: final payable amount
    const grandReceivables = grandTotal + grandShipping - grandDiscount;
    if (!isOpen) return null;
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
                                    Invoice No.
                                </label>
                                <input
                                type="text"
                                id="PONumber"
                                value={SIPreview}
                                readOnly
                                className="
                                  w-full mt-1 px-3 py-1.5 h-9 rounded-md
                                  border border-slate-300 dark:border-slate-600
                                  bg-slate-100 dark:bg-slate-800
                                  text-slate-500 dark:text-slate-400
                                  cursor-not-allowed
                                "
                              />
                            </div>
                            
                            {/* Customer  FIELD */}
                            <CustomFormSelect
                                label="Customer"
                                name="customer"
                                options={customerOptions}
                                initialValue={formValues.customer}
                                onSelect={handleCustomerSelect}
                                placeholder={loadingCustomers ? "Loading customer..." : "Select Customer"}
                            />
                            <button className="cursor-pointer flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                            onClick={handleOpenCustomerModal} type="button"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="text-sm font-medium">Add Customer</span>
                            </button>
                            <div> 
                                <label htmlFor="transaction_date" 
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300"> 
                                Transaction Date 
                                </label> 
                                <input type="date" 
                                id="transaction_date"
                                name="transaction_date"
                                value={formValues.transaction_date}
                                onChange={(e) => handleInputChange(e.target.value, e.target.name)} 
                                className="relative z-10 w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white" /> 
                            </div>
                            

                            <div>
                                <label htmlFor="ContactNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Contact Number
                                </label>
                                <input 
                                    type="text" 
                                    id="ContactNumber"
                                    value={formValues.contactno}
                                    className="w-full text-slate-700 
                                    dark:text-slate-200 mt-1 px-3 py-1.5 h-9 
                                    rounded-md border border-slate-300 dark:border-slate-600 
                                    bg-white dark:bg-slate-700 shadow-xs focus:outline-none 
                                    focus:border-blue-500 dark:focus:border-blue-500 
                                    focus:caret-slate-500 dark:focus:caret-white"
                                    readOnly
                                />
                            </div>

                            <div className = "col-span-2">
                                <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                                
                                <input type = "text" id="Address" name="Address" rows="2" value={formValues.address}
                                    readOnly 
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

                                {/* COMPUTATION UPLOAD FIELD */}
                                <label className="block mb-3 text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="file_input">Computation</label>
                                <div className="relative flex rounded-lg overflow-hidden w-full max-w-xs bg-white border border-slate-300 dark:bg-slate-700 dark:border-slate-600 hover:border-blue-400 shadow-xs">
                                    <span className="bg-slate-400/20 dark:bg-slate-600/90 text-slate-600/80 dark:text-slate-400/80 px-3 py-2 text-sm font-medium flex items-center select-none cursor-pointer">
                                        Choose File
                                    </span>
                                    
                                    <span className="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm flex items-center truncate overflow-hidden whitespace-nowrap min-w-0">
                                        {computationFileName}
                                    </span>
                                    
                                    <input type="file" id="file_input" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleComputationFileChange}/>
                                </div>
                                {/* PROOF UPLOAD FIELD */}
                                <label className="block mb-3 text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="file_input">Delivery Receipt</label>
                                <div className="relative flex rounded-lg overflow-hidden w-full max-w-xs bg-white border border-slate-300 dark:bg-slate-700 dark:border-slate-600 hover:border-blue-400 shadow-xs">
                                    <span className="bg-slate-400/20 dark:bg-slate-600/90 text-slate-600/80 dark:text-slate-400/80 px-3 py-2 text-sm font-medium flex items-center select-none cursor-pointer">
                                        Choose File
                                    </span>
                                    
                                    <span className="text-slate-500 dark:text-slate-400 px-4 py-2 text-sm flex items-center truncate overflow-hidden whitespace-nowrap min-w-0">
                                        {receiptFileName}
                                    </span>
                                    
                                    <input type="file" id="file_input" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handlePaymentFileChange}/>
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
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Trading Items</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Commissary Items</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200 text-end">Other Items/Services</td>
                                            </tr>
                                            <tr className="bg-slate-200/50 dark:bg-slate-700/50">
                                                <td className="py-3 px-4 text-sm text-slate-700 font-medium dark:text-slate-200">Merchandise Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{standardSubtotal.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{premiumSubtotal.toFixed(2)}</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{othersSubtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200">
                                                    Shipping Subtotal
                                                </td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">
                                                    {standardShipping.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">
                                                    {premiumShipping.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                                                    {othersShipping.toFixed(2)}
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200">
                                                    Item Discount Subtotal
                                                </td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">
                                                    {standardDiscount.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-xs text-slate-700 dark:text-slate-200 text-end">
                                                    {premiumDiscount.toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">
                                                    {othersDiscount.toFixed(2)}
                                                </td>
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
                                                    <span className  = "mr-2 text-lg font-normal">Total Payment: </span> <span className = "text-lg ">{grandReceivables.toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 mt-4 border-t border-slate-300 dark:border-slate-700 flex justify-end space-x-3 flex-shrink-0">
                            <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                                Save Purchase
                            </button>
                        </div>
                    </form>

                </div>
            </div>

            <AddItemModal 
                isOpen={isItemModalOpen} 
                onClose={handleCloseItemModal} 
                onAddItem={handleAddItem} 
                loadItemList={itemList}
            />
            <AddCustomerModal
                isOpen={isAddModalOpen} 
                onClose={handleCloseCustomerModal} 
            />
        </>
    );
}

export default CreateInvoiceModal;
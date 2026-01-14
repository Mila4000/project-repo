import React, { useState,useMemo, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";

import CustomFormSelect from "../filter/CustomFormSelect";
import AddItemModal from "./AddItemModal";
import { calculatePurchaseTotals } from "../../utils/paymentCalculator";
import { uploadReceipt } from "../../utils/storageHelpers";

/* -------------------------------------------------------------------------- */
/*                                   DATA                                     */
/* -------------------------------------------------------------------------- */

const warehouseData = [
  { warehouse: "Saog" },
  { warehouse: "Meycuayan" },
  { warehouse: "Quezon City" },
];

/* -------------------------------------------------------------------------- */
/*                             MAIN COMPONENT                                 */
/* -------------------------------------------------------------------------- */

function AddPurchaseOrderModal({ isOpen, onClose, onAddPurchase,itemList }) {
  /* ----------------------------- STATE ----------------------------------- */

  const [suppliers, setSuppliers] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptFileName, setReceiptFileName] = useState("No file chosen");

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const getToday = () => {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  };


  const [formValues, setFormValues] = useState({
    PONumber: "",
    supplier: null,
    transaction_date: getToday(),
    delivery_date: getToday(),
    warehouse: null,
    remarks: "",
  });

  /* ----------------------------- HANDLERS -------------------------------- */

  const handleInputChange = (value, name) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  const handleOpenItemModal = () => setIsItemModalOpen(true);
  const handleCloseItemModal = () => setIsItemModalOpen(false);

  const handleAddItem = (newItem) => {
    setPurchaseItems((prev) => [
      ...prev,
      { ...newItem, id: Date.now() },
    ]);
    handleCloseItemModal();
  };

  const handleRemoveItem = (id) => {
    setPurchaseItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setReceiptFile(file);
    setReceiptFileName(file ? file.name : "No file chosen");
  };
  /* ----------------------------- SUBMIT ---------------------------------- */

  const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (!purchaseItems.length) {
    alert("Please add at least one item before submitting the purchase order.");
    return;
  }

  if (!formValues.supplier || !formValues.transaction_date || !formValues.delivery_date) {
    alert("Please complete all required fields.");
    return;
  }

  try {
    // 1️⃣ CREATE PURCHASE (NO RECEIPT YET)
    const newPurchase = {
      supplier: formValues.supplier,
      warehouse: formValues.warehouse,
      transaction_date: new Date(formValues.transaction_date).toISOString(),
      delivery_date: new Date(formValues.delivery_date).toISOString(),
      items: purchaseItems.map(item => ({
        name: item.brand,
        type: item.type,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        discount:Number(item.discount),
        shipping:Number(item.shipping),

      })),
        // ✅ PAYMENT TOTALS
      merchandise_subtotal: Number(merchandiseSubtotal),
      shipping_subtotal: Number(shippingSubtotal),
      discount_subtotal: Number(discountSubtotal),
      total_payment: Number(totalPayment),
      
      approval_status: "Pending",
      delivery_status: "Order Placed",
      payment_status: "Unpaid",
      remarks: formValues.remarks
    };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/purchasing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPurchase),
    });

    if (!response.ok) {
      const errorPayload = await response.json();
      throw new Error(errorPayload?.message || "Failed to save purchase");
    }

    const savedPurchase = await response.json(); 
    // 👆 contains { id, po }

    // 2️⃣ UPLOAD RECEIPT (OPTIONAL)
    if (receiptFile) {
      const receiptPath = await uploadReceipt(receiptFile, savedPurchase.po);

      // 3️⃣ UPDATE PURCHASE WITH RECEIPT PATH
      await fetch(`${import.meta.env.VITE_API_URL}/api/purchasing/${savedPurchase.id}/receipt`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt_url: receiptPath }),
      });
    }

    onAddPurchase(savedPurchase);
    handleClose();

  } catch (err) {
    console.error("Purchase submission error:", err);
    alert("An unexpected error occurred while saving the purchase order.");
  }
};


  /* ----------------------------- COMPUTED -------------------------------- */

  const supplierOptions = suppliers.map((s) => ({
    value: s.id,
    label: s.businessname,
  }));

  const warehouseOptions = warehouseData.map((w) => ({
    value: w.warehouse,
    label: w.warehouse,
  }));

    const paymentTotals = useMemo(() => {
        return calculatePurchaseTotals(purchaseItems);
    }, [purchaseItems]);

    const {
        merchandiseSubtotal,
        shippingSubtotal,
        discountSubtotal,
        totalPayment
    } = paymentTotals;
  /* ----------------------------- EFFECTS --------------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/supplier`);
        const data = await res.json();
        setSuppliers(data);
      } catch (err) {
        console.error("Failed to load suppliers", err);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    fetchSuppliers();
  }, [isOpen]);

  /* ----------------------------- GUARD ----------------------------------- */

  if (!isOpen) return null;

  /* ----------------------------- JSX ------------------------------------- */
    return (
        <>
            <div className="fixed inset-0 bg-black/20 dark:bg-black/20 z-40 overflow-y-auto">
                <div className="relative my-10 mx-auto max-w-4xl bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl">
                    
                    <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Create New Purchase (PO)
                        </h2>

                        <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>
                    

                    <form onSubmit={handleFormSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            
                            {/* SUPPLIER FIELD */}
                            <CustomFormSelect
                            label="Supplier"
                            name="supplier"
                            options={supplierOptions}
                            initialValue={formValues.supplier}
                            onSelect={handleInputChange}
                            placeholder={loadingSuppliers ? "Loading suppliers..." : "Select supplier"}
                            />

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
                                <label htmlFor="delivery_date" 
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300"> 
                                Delivery Date 
                                </label> 
                                <input type="date" 
                                id="delivery_date"
                                name="delivery_date"
                                value={formValues.delivery_date}
                                onChange={(e) => handleInputChange(e.target.value, e.target.name)} 
                                className="relative z-10 w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white" /> 
                            </div>
                            

                            {/* WAREHOUSE FIELD */}
                            <CustomFormSelect
                                label="Warehouse"
                                name="warehouse"
                                options={warehouseOptions}
                                initialValue={formValues.warehouse}
                                onSelect={handleInputChange} 
                            />
                            
                        </div>

                        {/* Product List Table Section */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                {/* REMARKS FIELD */}
                                <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Remarks
                                </label>
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows="3"
                                    value={formValues.remarks}
                                    onChange={(e) => handleInputChange(e.target.value, e.target.name)}
                                    className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white resize-none text-slate-700 dark:text-slate-200"
                                />

                                {/* FILE UPLOAD FIELD */}
                                <label className="block mb-2.5 text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="file_input">Upload file</label>
                                <div className="relative flex rounded-lg overflow-hidden w-full max-w-xs bg-white border border-slate-300 dark:bg-slate-700 dark:border-slate-600 hover:border-blue-400 shadow-xs">
                                    <span className="bg-slate-400/20 dark:bg-slate-600/90 text-slate-600/80 dark:text-slate-400/80 px-3 py-2 text-sm font-medium flex items-center select-none cursor-pointer">
                                        Choose File
                                    </span>
                                    
                                    <span className="text-slate-800 dark:text-white px-4 py-2.5 text-sm flex items-center truncate overflow-hidden whitespace-nowrap min-w-0">
                                        {receiptFileName}
                                    </span>
                                    
                                    <input type="file" id="file_input" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange}/>
                                </div>
                            </div>
                            
                            {/* Payment Details */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Payment Details</label>
                                <div className = "w-full rounded-md overflow-hidden border border-slate-300 dark:border-slate-700">
                                    <table className="w-full">
                                        <tbody>
                                            <tr className = "bg-slate-200/50 dark:bg-slate-700/50">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Merchandise Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{merchandiseSubtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Shipping Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{shippingSubtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Item Discount Subtotal</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 text-end">{discountSubtotal.toFixed(2)}</td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200">Order Discount</td>
                                                <td className="py-3 px-4 text-end">
                                                  {!isEditing ? (
                                                    <span
                                                      className="cursor-pointer text-sm text-slate-700 dark:text-slate-200"
                                                      onClick={() => setIsEditing(true)}
                                                    >
                                                      {discount.toFixed(2)}
                                                    </span>
                                                  ) : (
                                                    <input
                                                      type="number"
                                                      autoFocus
                                                      min="0"
                                                      step="0.01"
                                                      value={discount}
                                                      onChange={(e) => setDiscount(Number(e.target.value))}
                                                      onBlur={() => setIsEditing(false)}
                                                      className="
                                                        w-28 text-end rounded-md border border-slate-300
                                                        bg-white px-2 py-1 text-sm text-slate-700
                                                        focus:outline-none focus:ring-2 focus:ring-blue-500
                                                        dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200
                                                      "
                                                    />
                                                  )}
                                                </td>
                                            </tr>
                                            <tr className = "hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold">Total Payment</td>
                                                <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-200 font-medium dark:font-bold text-end">{totalPayment.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={handleClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                                Save Purchase
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Render the new AddItemModal here */}
            <AddItemModal 
                isOpen={isItemModalOpen} 
                onClose={handleCloseItemModal} 
                onAddItem={handleAddItem} 
                loadItemList={itemList}
            />
        </>
    );
}

export default AddPurchaseOrderModal;
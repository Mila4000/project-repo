import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

import ModalCustomFormSelect from '../../components/filter/ModalCustomFormSelect'; 

const approvalStatusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Approved', label: 'Approved' },
];

const deliveryStatusOptions = [
    { value: 'Out for Delivery', label: 'Out for Delivery' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Order Placed', label: 'Order Placed' },
];

const paymentStatusOptions = [
    { value: 'Paid', label: 'Paid' },
    { value: 'Unpaid', label: 'Unpaid' },
    { value: 'N/A', label: 'N/A' }, 
];

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'delivering', label: 'Delivering' },
    { value: 'completed', label: 'Completed' },
];


function EditPurchaseOrderModal({ isOpen, onClose, orderData, onSave }) {
    const [formValues, setFormValues] = useState({
    po: "",
    supplier_id: null,
    total: "",
    transaction_date: "",
    delivery_date: "",
    approval_status: "",
    delivery_status: "",
    payment_status: "",
    status: "",
    remarks: ""
    });
    
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
    if (!orderData || !isOpen) return;

    setFormValues({
        po: orderData.po ?? "",
        supplier_id:
        orderData.supplier_id ??
        orderData.supplier?.id ??
        null,
        total: orderData.total ?? "",
        transaction_date: orderData.transaction_date ?? "",
        delivery_date: orderData.delivery_date ?? "",
        approval_status: orderData.approval_status ?? "",
        delivery_status: orderData.delivery_status ?? "",
        payment_status: orderData.payment_status ?? "",
        status: orderData.status ?? "",
        remarks: orderData.remarks ?? ""
    });
    }, [orderData, isOpen]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const supplierOptions = suppliers.map(s => ({
    value: Number(s.id),
    label: s.businessname
    }));
    useEffect(() => {
    if (!isOpen) return;

    const fetchSuppliers = async () => {
        setLoadingSuppliers(true);
        try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier`);
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

    
    if (!isOpen || !orderData) return null;
    const resetForm = () => {
    setFormValues({
        po: "",
        supplier_id: null,
        total: "",
        transaction_date: "",
        delivery_date: "",
        approval_status: "",
        delivery_status: "",
        payment_status: "",
        status: "",
        remarks: ""
    });
    };
    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Handler supports both standard input events and direct {name, value} objects from ModalCustomFormSelect
    const handleInputChange = (input) => {
        let name, value;
        
        if (input.target) {
            name = input.target.name;
            value = input.target.value;
        } else {
            name = input.name;
            value = input.value;
        }

        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formValues); 
        resetForm();
    };
    return (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/20 z-40 overflow-y-auto">
            <div className="relative my-10 mx-auto max-w-4xl bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl">
                    
                <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Edit Purchase Order
                    </h2>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. PO Number (Read Only) */}
                        <div>
                            <label htmlFor="PO" className="block text-sm font-medium text-slate-700 dark:text-slate-300">PO No.</label>
                            <input type="text" id="PO" name="PO" value={formValues.po || ''} readOnly
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700/50 shadow-xs text-slate-500 dark:text-slate-400" />
                        </div>
                        
                        {/* 2. Total (Editable) */}
                        <div>
                            <label htmlFor="total" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Total</label>
                            <input type="text" id="total" name="total" value={formValues.total || ''} onChange={handleInputChange}
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* 3. Transaction Date (Editable) */}
                        <div>
                            <label htmlFor="transaction_date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Transaction Date</label>
                            <input
                            type="date"
                            id="transaction_date"
                            name="transaction_date"
                            value={formValues.transaction_date || ""}
                            onChange={handleInputChange}
                            className="relative z-10 w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                            />
                        </div>

                        {/* 4. Delivery Date (Editable) */}
                        <div>
                            <label htmlFor="deliverydate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Delivery Date</label>
                            <input
                            type="date"
                            id="deliverydate"
                            name="deliverydate"
                            value={formValues.delivery_date || ""}
                            onChange={handleInputChange}
                            className="relative z-10 w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:caret-slate-500 dark:focus:caret-white"
                            />
                        </div>
                        
                        {/* 5. Supplier (ModalCustomFormSelect) */}
                        <div>
                            {loadingSuppliers ? (
                                <div className="text-sm text-gray-400">Loading suppliers…</div>
                            ) : (
                                <ModalCustomFormSelect
                                label="Supplier"
                                name="supplier_id"
                                options={supplierOptions}
                                currentValue={formValues.supplier_id}
                                onSelect={handleInputChange}
                                />
                            )}
                            </div>
                        

                        {/* 6. Approval Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect
                                label="Approval Status"
                                name="approval_status"
                                options={approvalStatusOptions}
                                currentValue={formValues.approval_status} 
                                onSelect={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* New Row for additional Status Selects (3 fields) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 7. Delivery Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect
                                label="Delivery Status"
                                name="delivery_status"
                                options={deliveryStatusOptions}
                                currentValue={formValues.delivery_status}
                                onSelect={handleInputChange}
                            />
                        </div>

                        {/* 8. Payment Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect
                                label="Payment Status"
                                name="payment_status"
                                options={paymentStatusOptions}
                                currentValue={formValues.payment_status}
                                onSelect={handleInputChange}
                            />
                        </div>
                        
                        {/* 9. Status (ModalCustomFormSelect) */}
                        <div>
                            <ModalCustomFormSelect
                                label="Status"
                                name="status"
                                options={statusOptions}
                                currentValue={formValues.status}
                                onSelect={handleInputChange}
                            />
                        </div>
                    </div>
                    
                    {/* Remarks (Full width) */}
                    <div>
                        <label htmlFor="remarks" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                        <textarea id="remarks" name="remarks" rows="2" value={formValues.remarks || ''} onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200 resize-none" />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={handleClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPurchaseOrderModal;
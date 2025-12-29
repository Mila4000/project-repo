// AddSupplierModal.jsx

import React, { useState } from 'react';
import { X } from 'lucide-react'; 

function AddSupplierModal({ isOpen, onClose, onAddSupplier }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        Name: '',
        businessName: '',
        Address: '',
        Email: '',
        ContactNo: '',
        tinNo: '',
        BankAcc: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const newSupplier = {
            name: formValues.Name,
            businessname: formValues.businessName,
            address: formValues.Address,
            email: formValues.Email,
            contactno: formValues.ContactNo,
            tinno: formValues.tinNo,
            bankaccount: formValues.BankAcc,
            status: "Active" 
        };
        try{
            const response = await fetch("http://localhost:5000/api/supplier", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newSupplier),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const savedSupplier = await response.json();
            onAddSupplier(savedSupplier);
            onClose();
        }
        catch(error){
            console.error("Failed to add supplier", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add New Supplier
                        </h2>

                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label htmlFor="Name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Supplier Name</label>
                            <input type="text" id="Name" name="Name" value={formValues.Name} onChange={handleInputChange} placeholder="Jane Dela Cruz"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input type="text" id="businessName" name="businessName" value={formValues.businessName} onChange={handleInputChange} placeholder="DC Meat Supply"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Contact No */}
                        <div>
                            <label htmlFor="ContactNo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input type="text" id="ContactNo" name="ContactNo" value={formValues.ContactNo} onChange={handleInputChange} placeholder="0917xxxxxxx"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="Email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" id="Email" name="Email" value={formValues.Email} onChange={handleInputChange} placeholder="jane.dcruz@email.com"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* TIN No */}
                        <div>
                            <label htmlFor="tinNo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">TIN No.</label>
                            <input type="text" id="tinNo" name="tinNo" value={formValues.tinNo} onChange={handleInputChange} placeholder="123-456-789-000"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Bank Account */}
                        <div>
                            <label htmlFor="BankAcc" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Bank Account No.</label>
                            <input type="text" id="BankAcc" name="BankAcc" value={formValues.BankAcc} onChange={handleInputChange} placeholder="9876543210 (BDO)"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                    </div>
                    
                    {/* Address (Full width) */}
                    <div>
                        <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                        <input type = "text" id="Address" name="Address" rows="2" value={formValues.Address} onChange={handleInputChange} placeholder="123 Main Street, Quezon City"
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className=" px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className=" px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Supplier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSupplierModal;
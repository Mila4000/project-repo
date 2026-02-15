import React, { useState } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect'; 

const CustomerTypeOptions = [
    { customerType: 'Regular' },
    { customerType: 'VIP' },
    { customerType: 'Vacuum' },
    { customerType: 'Unpack' }
];

function AddCustomerModal({ isOpen, onClose, onCustomerAdded }) {
    if (!isOpen) return null;

    const [formValues, setFormValues] = useState({
        name: '',
        business_name: '',
        address: '',
        email: '',
        contactno: '',
        facebook_name: '',
        cus_type: ''
    });

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        setFormValues(prev => 
        ({ ...prev, 
            [name]: value 
        })); 
    };
    const handleCustomerTypeChange = (value, name) => {
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleNumberChanges = (e) => { 
    const { name, value } = e.target;

    const digitsOnly = value.replace(/\D/g, '');

    setFormValues(prev => ({ 
        ...prev,
        [name]: digitsOnly
    })); 
    };


    const handleSubmit =async (e) => {
        e.preventDefault();
        try {
            const res=await fetch(
                `${import.meta.env.VITE_API_URL}/api/customers`,
                {
                    method:"POST", 
                    headers:{"Content-Type": "application/json"},
                    body:JSON.stringify(formValues)
                }
            );
            if(!res.ok){
                const errText = await response.text();
                console.error("Backend error:", errText);
                throw new Error("Failed to save purchase");
            }
        } catch (error) {
            console.error(err);
            alert("Error saving purchase. See console.");
        }
        

        setFormValues({ name: '',
        business_name: '',
        address: '',
        email: '',
        contactno: '',
        facebook_name: '',
        cus_type: '',
        });
        await onCustomerAdded();
        onClose();
    };

    const CustomerTypes = CustomerTypeOptions.map(d => ({ value: d.customerType, label: d.customerType }));

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-4" 
                onClick={e => e.stopPropagation()}>

                <div className = "w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                            Add New Customer
                        </h2>

                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                            <input type="text" id="name" name="name" value={formValues.name} onChange={handleInputChange} placeholder="Enter Name"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        <div>
                            <label htmlFor="facebook_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">FB Name</label>
                            <input type="text" id="facebook_name" name="facebook_name" value={formValues.facebook_name} onChange={handleInputChange} placeholder="Enter Facebook Name"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" required />
                        </div>

                        {/* Contact No */}
                        <div>
                            <label htmlFor="business_name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input type="text" id="business_name" name="business_name" value={formValues.business_name} onChange={handleInputChange} placeholder="Enter Business Name"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" id="email" name="email" value={formValues.email} onChange={handleInputChange} placeholder="Enter email"
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        {/* TIN No */}
                        <div>
                            <label htmlFor="contactno" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input
                                type="text"
                                maxLength={11}        // ← React uses camelCase
                                id="contactno"
                                name="contactno"
                                value={formValues.contactno}
                                onChange={handleNumberChanges}
                                placeholder="0900xxxxxxx"
                                inputMode="numeric"   // 📱 mobile numeric keypad
                                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200"
                            />
                        </div>
                        
                        <CustomFormSelect
                        label="Customer Type"
                        name="cus_type"
                        options={CustomerTypes}
                        initialValue={formValues.cus_type}
                        onSelect={handleCustomerTypeChange}
                        />
                    </div>
                    
                    {/* Address (Full width) */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                        <input type = "text" id="address" name="address" rows="2" value={formValues.address} onChange={handleInputChange} placeholder="Enter Address"
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200 resize-none" />
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                            Add Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCustomerModal;
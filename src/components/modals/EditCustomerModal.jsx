import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ModalCustomFormSelect from '../../components/filter/ModalCustomFormSelect'; 

const customerType = [
    { label: 'Regular', value: 'Regular' },
    { label: 'VIP', value: 'VIP' },
    { label: 'Vacuum', value: 'Vacuum' },
    { label: 'Unpack', value: 'Unpack' }
]
const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
];

function EditCustomerModal({ isOpen, onClose, customerData, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        business_name: '',
        address: '',
        email: '',
        contactno: '',
        facebook_name: '',
        cus_type: '',
        status:'',
        bankaccount:''
    });
    
    // Sync state when supplierData changes
    useEffect(() => {
        if (customerData) {
            setFormData(customerData);
        } else {
            setFormData({});
        }
    }, [customerData]);

    if (!isOpen) return null;

    // Smart handler: works for both standard inputs and Custom Selects
    const handleInputChange = (input) => {
        let name, value;
        if (input.target) {
            // Logic for standard <input> (e.target)
            name = input.target.name;
            value = input.target.value;
        } else {
            // Logic for ModalCustomFormSelect (passed as { name, value })
            name = input.name;
            value = input.value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting", formData)
        onSave(formData);
    };
    console.log(formData);
    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Edit Customer Details</h2>
                    <button onClick={onClose} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className = "p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">FB Name</label>
                            <input name="facebook_name" value={formData.facebook_name} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Business Name</label>
                            <input name="business_name" value={formData.business_name} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <input name="email" value={formData.email} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact No.</label>
                            <input name="contactno" value={formData.contactno} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Bank Account No.</label>
                            <input name="bankaccount" value={formData.bankaccount} onChange={handleInputChange} className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                        </div>

                        <div className = "mt-1">
                            <ModalCustomFormSelect
                                label="Customer Type"
                                name="cus_type"
                                options={customerType}
                                currentValue={formData.cus_type}
                                onSelect={handleInputChange}
                            />
                        </div>
                        
                        <div className = "mt-1">
                            <ModalCustomFormSelect
                                label="Status"
                                name="status"
                                options={statusOptions}
                                currentValue={formData.status}
                                onSelect={handleInputChange}
                            />
                        </div>

                        
                    </div>

                    <div className = "mt-5">
                        <label htmlFor="Address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                            <input type= "text" id="Address" name="Address" rows="2" value={formData.address} onChange={handleInputChange} placeholder="123 Main Street, Quezon City"
                            className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-700 dark:text-slate-200" />
                    </div>

                    {/* Action Buttons */}
                    <div className="py-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:underline">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCustomerModal;
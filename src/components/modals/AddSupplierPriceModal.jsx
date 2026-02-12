import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';

// 1. Data mapped to the standard value/label format
const supplierData = [
    { supplier: 'Earl Meats Inc.' },
    { supplier: 'Javier Meats' },
    { supplier: 'Betez Trading' }
];



function AddSupplierPriceModal({ isOpen, onClose, onAdd }) {
    const [data, setData] = useState({ supplier: '', price: '' });
    const [supplier,setSupplier] = useState([])
    const fetchSuppliers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/supplier`);
        const object = await res.json();
        setSupplier(object);
      } catch (err) {
        console.error("Failed to load suppliers", err);
      }
    };
    useEffect(()=>{
        fetchSuppliers();
    },[isOpen]);

    const supplierOptions = supplier.map(item => ({
        value: item.businessname, 
        label: item.businessname 
    }));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.supplier || !data.price) {
            alert("Please select a supplier and enter a price.");
            return;
        }
        onAdd(data);
        setData({ supplier: '', price: '' }); // Reset
    };
   if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-800 dark:text-white">Add Supplier Pricing</h3>
                    <button onClick={onClose} className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-2 transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <CustomFormSelect 
                        label="Select Supplier"
                        name="supplier"
                        options={supplierOptions} // Now contains {value, label}
                        initialValue={data.supplier}
                        onSelect={(val) => setData({...data, supplier: val})}
                        placeholder="Choose a supplier..."
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
                        <input 
                            type="number" 
                            step="0.01"
                            value={data.price}
                            onChange={(e) => setData({...data, price: e.target.value})}
                            className="w-full px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer hover:underline">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                            Add to List
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddSupplierPriceModal;
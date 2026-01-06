import React, { useState } from 'react';
import { Plus, Trash2, X, Pencil } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect'; 
import AddSupplierPriceModal from './AddSupplierPriceModal'; 
import EditSupplierModal from './EditSupplierModal'; 

const warehouseData = [{ warehouse: 'Saog' }, { warehouse: 'Meycuayan' }, { warehouse: 'Quezon City' }];

function AddProductModal({ isOpen, onClose, supplierOptions }) {
    const [formValues, setFormValues] = useState({
        name: '',
        quantity: '',
        price: '',
        warehouse: null,
        remarks: '',
    });

    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const [supplierPrices, setSupplierPrices] = useState([]);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };


      const handleCustomForm = (value, name) => {
        setFormValues((prev) => ({
        ...prev,
        [name]: value,
        }));
    };
    // --- TOGGLE MODAL HELPERS ---
    const handleOpenPriceModal = () => setIsPriceModalOpen(true);
    const handleClosePriceModal = () => setIsPriceModalOpen(false);

    // --- ADD LOGIC ---
    const handleAddPrice = (newEntry) => {
        setSupplierPrices(prev => [...prev, { ...newEntry, id: Date.now() }]);
        handleClosePriceModal();
    };

    // --- EDIT LOGIC ---
    const handleOpenEdit = (item) => {
        setSelectedEntry(item);
        setIsEditModalOpen(true);
    };

    const handleUpdatePrice = (updatedEntry) => {
        setSupplierPrices(prev => prev.map(item => 
            item.id === updatedEntry.id ? updatedEntry : item
        ));
        setIsEditModalOpen(false);
        setSelectedEntry(null);
    };

    const handleRemovePrice = (id) => {
        setSupplierPrices(prev => prev.filter(item => item.id !== id));
    };
    
    const handleFormSubmit = async(e) => {
        e.preventDefault();
        console.log("Final Data:", { ...formValues, pricing: supplierPrices });
        const newStocks={
            ...formValues,pricing: supplierPrices 
        }
        try {
            const res = await fetch(
                "http://localhost:5000/api/stock",
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newStocks),
                }
            )
            if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText);
            }
        } catch (error) {
            console.error("Failed to save received items", error);
        }
        onClose();
    };

    const warehouseOptions = warehouseData.map(d => ({ value: d.warehouse, label: d.warehouse }));

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    
                    <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add Product</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300"/>
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-8">
                        {/* Top Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Name</label>
                                    <input type="text" 
                                    id="name"
                                    name="name"
                                    value={formValues.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter item name"
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Threshold Count</label>
                                    <input type="number"
                                    id="quantity"
                                    name="quantity"
                                    value={formValues.quantity}
                                    onChange={handleInputChange}
                                    placeholder="Enter threshold count"
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Suggested Retail Price (SRP)</label>
                                    <input type="number" 
                                    id="price"
                                    name="price"
                                    value={formValues.price}
                                    onChange={handleInputChange}
                                    placeholder="Enter price"
                                    className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <CustomFormSelect 
                                    label="Warehouse" 
                                    name="warehouse" 
                                    options={warehouseOptions} 
                                    initialValue={formValues.warehouse} 
                                    onSelect={handleCustomForm} 
                                />
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                                    <textarea name="remarks" rows="4" value={formValues.remarks} onChange={(e) => handleCustomForm(e.target.value, e.target.name)} className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 resize-none outline-none focus:border-blue-500" />
                                </div>
                            </div>
                        </div>

                        {/* Supplier Pricing Table Section */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-slate-800 dark:text-white text-xl font-bold">Supplier Pricing</h1>
                                <button type="button" onClick={handleOpenPriceModal} className="flex items-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer">
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Supplier Price</span>
                                </button>
                            </div>
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-700/50">
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Supplier Name</th>
                                        <th className="text-left p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Price</th>
                                        <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplierPrices.length > 0 ? (
                                        supplierPrices.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 text-sm text-slate-700 dark:text-slate-200">{item.supplier}</td>
                                                <td className="p-4 text-sm font-medium text-blue-600 dark:text-blue-400">₱{parseFloat(item.price).toFixed(2)}</td>
                                                <td className="p-4 text-center space-x-2">
                                                    <button type="button" onClick={() => handleOpenEdit(item)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                        <Pencil className="w-5 h-5" />
                                                    </button>
                                                    <button type="button" onClick={() => handleRemovePrice(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className = "border-b border-slate-200 dark:border-slate-700">
                                            <td colSpan="3" className="p-4 text-center text-sm text-slate-500 italic">No supplier pricing added yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="cursor-pointer px-5 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer">Save Product</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ADD MODAL */}
            <AddSupplierPriceModal 
                isOpen={isPriceModalOpen} 
                onClose={handleClosePriceModal} 
                onAdd={handleAddPrice} 
                supplierOptions={supplierOptions} 
            />

            {/* EDIT MODAL */}
            <EditSupplierModal 
                key={selectedEntry?.id || 'edit-modal'} 
                isOpen={isEditModalOpen} 
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedEntry(null);
                }} 
                onUpdate={handleUpdatePrice} 
                initialData={selectedEntry} 
            />
        </>
    );
}

export default AddProductModal;
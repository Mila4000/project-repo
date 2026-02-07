import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Pencil, Calendar } from 'lucide-react'; 
import CustomFormSelect from '../filter/CustomFormSelect';
import AddItemToShipModal from './AddItemToShipModal';
import EditItemToShipModal from './EditItemToShipModal'; 

const warehouseData = [{ warehouse: 'Saog' }, { warehouse: 'Meycuayan' }, { warehouse: 'Quezon City' }];

function EditStockTransferDetailsModal({ isOpen, onClose, itemOptions, initialData }) {
    const [formValues, setFormValues] = useState({
        transferDate: '', 
        sendingWarehouse: null,
        receivingWarehouse: null, 
        expectedDeliveryDate: '',
        remarks: '',
    });

    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [shipmentItems, setShipmentItems] = useState([]); 
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        if (initialData && isOpen) {
            setFormValues({
                transferDate: initialData.TransferDate || '',
                sendingWarehouse: initialData.Sender || null,
                receivingWarehouse: initialData.Receiver || null,
                expectedDeliveryDate: initialData.ExpectedDate || '', 
                remarks: initialData.Remarks || '',
            });
            // If the row data includes items, set them here
            setShipmentItems(initialData.items || []);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (value, name) => {
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (newEntry) => {
        setShipmentItems(prev => [...prev, { ...newEntry, id: Date.now() }]);
        setIsAddItemModalOpen(false);
    };

    const handleOpenEdit = (item) => {
        setSelectedEntry(item);
        setIsEditModalOpen(true);
    };

    const handleUpdateItem = (updatedEntry) => {
        setShipmentItems(prev => prev.map(item => 
            item.id === updatedEntry.id ? updatedEntry : item
        ));
        setIsEditModalOpen(false);
        setSelectedEntry(null);
    };

    const handleRemoveItem = (id) => {
        setShipmentItems(prev => prev.filter(item => item.id !== id));
    };
    
    const handleFormSubmit = (e) => {
        e.preventDefault();
        onClose();
    };

    const warehouseOptions = warehouseData.map(d => ({ value: d.warehouse, label: d.warehouse }));

    return (
        <>
            <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                    
                    <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Stock Transfer</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300"/>
                        </button>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Transfer Date</label>
                                    <input 
                                        type="text" 
                                        name="transferDate"
                                        value={formValues.transferDate}
                                        onChange={(e) => handleInputChange(e.target.value, 'transferDate')}
                                        className="w-full text-slate-700 dark:text-slate-200 mt-1 px-3 py-1.5 h-9 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:border-blue-500" 
                                    />
                                </div>
                                
                                <CustomFormSelect 
                                    label="Sending Warehouse" 
                                    name="sendingWarehouse" 
                                    options={warehouseOptions} 
                                    initialValue={formValues.sendingWarehouse} 
                                    onSelect={handleInputChange} 
                                />

                                <CustomFormSelect 
                                    label="Receiving Warehouse" 
                                    name="receivingWarehouse" 
                                    options={warehouseOptions} 
                                    initialValue={formValues.receivingWarehouse} 
                                    onSelect={handleInputChange} 
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="w-full">
                                    <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Expected Delivery Date
                                    </label>
                                    <div className="relative"> 
                                        <input
                                            type="date"
                                            id="date"
                                            name="expectedDeliveryDate" 
                                            value={formValues.expectedDeliveryDate} 
                                            onChange={(e) => handleInputChange(e.target.value, 'expectedDeliveryDate')} 
                                            className="w-full px-3 py-2 text-sm rounded-md border border-slate-300 bg-white text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition appearance-none pr-10" 
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <Calendar className="w-5 h-5 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Remarks</label>
                                    <textarea 
                                        name="remarks" 
                                        rows="4" 
                                        value={formValues.remarks} 
                                        onChange={(e) => handleInputChange(e.target.value, 'remarks')} 
                                        className="mt-1 p-2 block w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 resize-none outline-none focus:border-blue-500" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Items to Ship Table Section */}
                        <div className="overflow-x-auto pb-3">
                            <div className="flex items-center justify-between mb-3">
                                <h1 className="text-slate-800 dark:text-white text-xl font-bold">Items to Ship</h1>
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddItemModalOpen(true)} 
                                    className="flex items-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add Item</span>
                                </button>
                            </div>
                            
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-100 dark:bg-slate-700/50">
                                            <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item</th>
                                            <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Quantity (KG)</th>
                                            <th className="text-center p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {shipmentItems.length > 0 ? (
                                            shipmentItems.map((item) => (
                                                <tr key={item.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="p-4 text-center text-sm text-slate-700 dark:text-slate-200">{item.itemName}</td>
                                                    <td className="p-4 text-center text-sm font-medium text-blue-600 dark:text-blue-400">{item.quantity} KG</td>
                                                    <td className="p-4 text-center space-x-2">
                                                        <button type="button" onClick={() => handleOpenEdit(item)} className="text-blue-500 hover:text-blue-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                                <td colSpan="3" className="p-8 text-center text-sm text-slate-500 italic">No items added to shipment yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer">Update Transfer</button>
                        </div>
                    </form>
                </div>
            </div>

            <AddItemToShipModal 
                isOpen={isAddItemModalOpen} 
                onClose={() => setIsAddItemModalOpen(false)} 
                onAdd={handleAddItem} 
                itemOptions={itemOptions} 
            />

            <EditItemToShipModal 
                key={selectedEntry?.id || 'edit-modal'} 
                isOpen={isEditModalOpen} 
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedEntry(null);
                }} 
                onUpdate={handleUpdateItem} 
                initialData={selectedEntry} 
            />
        </>
    );
}

export default EditStockTransferDetailsModal;
    import React, { useState, useMemo, useEffect } from 'react';
    import { Plus, X } from 'lucide-react'; 
    import CustomFormSelect from '../filter/CustomFormSelect'; 

    // Define the categories for the dropdown
    const TYPE_LABELS = {
    UNPACK: "Trading Items",
    VIP: "Commissary Items",
    VACUUM: "Valuable Items",
    };

    function EditItemModal({isOpen, onClose, editingItem, onSaveLocalItem, loadItemList}) {
        /* =======================
        ITEM FORM STATE
        ======================= */

        const [itemForm, setItemForm] = useState({
        brand: "",
        type: "",
        quantity: 0,
        unitPrice: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        });
                console.log("Editing Item:", editingItem);
        /* =======================
        AUTO TOTAL CALCULATION
        ======================= */

        useEffect(() => {
        if (editingItem) {
            setItemForm({
            brand: editingItem.product_name ?? "",
            type: editingItem.type ?? "",
            quantity: editingItem.quantity ?? 0,
            unitPrice: editingItem.unit_price ?? 0,
            shipping: editingItem.shipping ?? 0,
            discount: editingItem.discount ?? 0,
            total: editingItem.line_total + editingItem.shipping - editingItem.discount,
            });
        }
        }, [editingItem]);

            const BRAND_OPTIONS = [
        ...new Map(
            loadItemList?.map(item => [item.item_name, {
            value: item.item_name,
            label: item.item_name,
            }])
        ).values()
    ];  
        const selectedItem = useMemo(() => {
        if (!itemForm.brand) return null;
    
        return loadItemList?.find(
            (item) => item.item_name === itemForm.brand
        ) || null;
        }, [itemForm.brand, loadItemList]);
    
        /* =======================
        INPUT HANDLERS
        ======================= */
       useEffect(() => {
          if (!selectedItem) return;
      
          setItemForm((prev) => ({
              ...prev,
              id: selectedItem.id,
              unitPrice: selectedItem.suggested_retail_price ?? 0,
              type: TYPE_LABELS[selectedItem.item_type] ?? selectedItem.item_type,
          }));
          }, [selectedItem]);
      
          useEffect(() => {
          const quantity = Number(itemForm.quantity) || 0;
          const unitPrice = Number(itemForm.unitPrice) || 0;
          const shipping = Number(itemForm.shipping) || 0;
          const discount = Number(itemForm.discount) || 0;
      
          setItemForm((prev) => ({
              ...prev,
              total: quantity * unitPrice + shipping - discount,
              }));
          }, [
          itemForm.quantity,
          itemForm.unitPrice,
          itemForm.shipping,
          itemForm.discount,
          ]);
        // Standard input handler
        const handleItemChange = (e) => {
            const { name, value, type } = e.target;

            const parsedValue =
                type === "number" || name === "quantity" || name === "unitPrice"
                ? value === ""
                    ? ""
                    : parseFloat(value)
                : value;

            setItemForm((prev) => ({
                ...prev,
                [name]: parsedValue,
            }));
        };

        // Custom select handler
        const handleSelectChange = (value, name) => {
            setItemForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        };

        /* =======================
        SAVE HANDLER
        ======================= */
        const handleSave = (e) => {
        e.preventDefault();

        const finalItem = {
            id: editingItem.id,
            product_name: itemForm.brand,
            type: itemForm.type,
            quantity: Number(itemForm.quantity),
            unit_price: Number(itemForm.unitPrice),
            shipping: Number(itemForm.shipping),
            discount: Number(itemForm.discount),
            line_total: Number(itemForm.quantity * itemForm.unitPrice),
        };
        onSaveLocalItem(finalItem);
        };
        /* =======================
        MODAL GUARD
        ======================= */

        if (!isOpen) return null;


        console.log("Load Item List:", loadItemList);
        console.log("Selected Item:", selectedItem);
        console.log("Item Form State:", itemForm);
        return (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
                    <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Product Item</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer"/>
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Brand Input */}
                        <div>
                            <CustomFormSelect
                            label="Brand"
                            name="brand"
                            options={BRAND_OPTIONS}
                            initialValue={itemForm.brand}
                            onSelect={handleSelectChange}
                            placeholder="Select brand..."
                            />

                        </div>

                        {/* Type*/}
                         <div>
                        <label
                            htmlFor="type"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Type
                        </label>

                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={itemForm.type}
                            disabled
                            className="w-full mt-1 px-3 py-1.5 rounded-md border 
                            bg-slate-200 dark:bg-slate-600 
                            text-slate-700 dark:text-slate-200 
                            cursor-not-allowed"
                        />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="Shipping" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Shipping</label>
                                <input 
                                    type="number" step="0.01" min="0" id="Shipping" name="shipping"
                                    value={itemForm.shipping}
                                    onChange={handleItemChange}
                                    className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="Discount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Discount</label>
                                <input 
                                    type="number" step="0.01" min="0" id="Discount" name="discount"
                                    value={itemForm.discount}
                                    onChange={handleItemChange}
                                    className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quantity (KG)</label>
                                <input 
                                    type="number" step="0.01" min="0" id="quantity" name="quantity"
                                    value={itemForm.quantity}
                                    onChange={handleItemChange}
                                    className="w-full mt-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="unitPrice" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Unit Price</label>
                                <input 
                                    type="number"
                                    id="unitPrice"
                                    name="unitPrice"
                                    value={itemForm.unitPrice}
                                    onChange={handleItemChange}
                                    disabled
                                    className={`w-full mt-1 px-3 py-1.5 rounded-md border 
                                    bg-slate-200 dark:bg-slate-600 cursor-not-allowed
                                    `}
                                    required
                                    />

                            </div>
                        </div>

                        

                        <div className="text-right pt-2">
                            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">Total:</span> 
                            <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">
                                {itemForm.total.toFixed(2)}
                            </span>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                                Edit Item
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    export default EditItemModal;
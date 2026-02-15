import { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import CustomFormSelect from '../filter/CustomFormSelect';

const TYPE_LABELS = {
  UNPACK: "Trading Items",
  VIP: "Commissary Items",
  VACUUM: "Valuable Items",
};

function AddItemModal({ isOpen, onClose, onAddItem, loadItemList, type }) {

  const isSellingItem = type === "Item";

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

  /* =======================
     BRAND OPTIONS
  ======================= */
  const BRAND_OPTIONS = [
    ...new Map(
      loadItemList?.map(item => [
        item.item_name,
        {
          value: item.item_name,
          label: item.item_name,
        }
      ])
    ).values()
  ];

  /* =======================
     SELECTED ITEM
  ======================= */
  const selectedItem = useMemo(() => {
    if (!itemForm.brand) return null;

    return loadItemList?.find(
      (item) => item.item_name === itemForm.brand
    ) || null;

  }, [itemForm.brand, loadItemList]);

  /* =======================
     AUTO POPULATE PRICE + TYPE
  ======================= */
  useEffect(() => {
    if (!selectedItem) return;

    setItemForm((prev) => ({
      ...prev,
      id: selectedItem.id,
      unitPrice: isSellingItem
        ? selectedItem.selling_price ?? 0
        : selectedItem.suggested_retail_price ?? 0,
      type: TYPE_LABELS[selectedItem.item_type] ?? selectedItem.item_type,
    }));

  }, [selectedItem, isSellingItem]);

  /* =======================
     AUTO TOTAL CALCULATION
  ======================= */
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

  /* =======================
     MODAL GUARD
  ======================= */
  if (!isOpen) return null;

  /* =======================
     INPUT HANDLERS
  ======================= */
  const handleItemChange = (e) => {
    const { name, value, type } = e.target;

    const parsedValue =
      type === "number"
        ? value === ""
          ? ""
          : parseFloat(value)
        : value;

    setItemForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

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
      ...itemForm,
      product_name: itemForm.brand,
      quantity: Number(itemForm.quantity) || 0,
      unitPrice: Number(itemForm.unitPrice) || 0,
      shipping: Number(itemForm.shipping) || 0,
      discount: Number(itemForm.discount) || 0,
      total: Number(itemForm.total) || 0,
    };

    if (!finalItem.brand) {
      alert("Please select a brand.");
      return;
    }

    if (!finalItem.type) {
      alert("Please select a type.");
      return;
    }

    if (finalItem.quantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (finalItem.unitPrice <= 0) {
      alert("Price must be greater than 0.");
      return;
    }

    onAddItem(finalItem);

    setItemForm({
      brand: "",
      type: "",
      quantity: 0,
      unitPrice: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    });
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center">
      <div
        className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-lg mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between mb-6 pb-6 border-b border-slate-300 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Add Product {type}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="w-7 h-7 text-slate-600 dark:text-slate-300 cursor-pointer" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">

          {/* Brand */}
          <CustomFormSelect
            label={`${type}`}
            name="brand"
            options={BRAND_OPTIONS}
            initialValue={itemForm.brand}
            onSelect={handleSelectChange}
            placeholder={`Select ${type.toLowerCase()}...`}
          />

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Type
            </label>
            <input
              type="text"
              value={itemForm.type}
              disabled
              className="w-full mt-1 px-3 py-1.5 rounded-md border 
              bg-slate-200 dark:bg-slate-800 
              text-slate-700 dark:text-slate-200 
              border-slate-300 dark:border-slate-600
              cursor-not-allowed"
            />
          </div>

          {/* Shipping & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Shipping
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="shipping"
                value={itemForm.shipping}
                onChange={handleItemChange}
                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Discount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="discount"
                value={itemForm.discount}
                onChange={handleItemChange}
                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                required
              />
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Quantity (KG)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="quantity"
                value={itemForm.quantity}
                onChange={handleItemChange}
                className="w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {isSellingItem ? "Selling Price" : "Unit Price"}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="unitPrice"
                value={itemForm.unitPrice}
                onChange={handleItemChange}
                disabled={!isSellingItem}
                className={`w-full mt-1 px-3 py-1.5 rounded-md border border-slate-300 dark:border-slate-600
                  ${!isSellingItem ? "bg-slate-200 dark:bg-slate-800 cursor-not-allowed" : ""}`}
                required
              />
            </div>

          </div>

          {/* Total */}
          <div className="text-right pt-2">
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Total:
            </span>
            <span className="ml-2 text-xl font-bold text-blue-600 dark:text-blue-400">
              {itemForm.total.toFixed(2)}
            </span>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Add Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default AddItemModal;
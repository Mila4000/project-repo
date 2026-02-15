import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Eye, Trash2 } from 'lucide-react'; 
import CustomWarehouseSelect from '../../components/filter/CustomSupplierSelect'; 
import CustomStatusSelect from '../../components/filter/CustomDeliveryStatusSelect';

const StocksData = [
    { warehouse_name: 'Saog', item_name: 'Jowls', item_code: 'M-JWLS-UNP', quantity: '50.00', suggested_retail_price: '220.00', status: 'In Stock' },
    { warehouse_name: 'Saog', item_name: 'Jowls', item_code: 'M-JWLS-VIP', quantity: '50.00', suggested_retail_price: '215.00', status: 'In Stock' },
    { warehouse_name: 'Quezon City', item_name: 'Premium Beef', item_code: 'M-PRBF-UNP', quantity: '10.15', suggested_retail_price: '465.00', status: 'Need Restock' },
    { warehouse_name: 'Meycuayan', item_name: 'Chicken', item_code: 'M-CHCK-VAC', quantity: '5.17', suggested_retail_price: '240.00', status: 'Critical Stock' },
    { warehouse_name: "Makati", item_name: "Salmon Fillet", item_code: "S-SF-SKN", quantity: "63.41", suggested_retail_price: "692.51", status: "Need Restock" },
    { warehouse_name: "Makati", item_name: "Tenderloin", item_code: "B-TL-VAC", quantity: "147.55", suggested_retail_price: "349.90", status: "Need Restock" },
    { warehouse_name: "Makati", item_name: "Shrimp", item_code: "SE-SHR-FRO", quantity: "75.40", suggested_retail_price: "416.33", status: "In Stock" },
    { warehouse_name: "Bocaue", item_name: "Ground Beef", item_code: "B-GB-STD", quantity: "38.80", suggested_retail_price: "877.37", status: "Need Restock" },
    { warehouse_name: "Quezon City", item_name: "Ground Beef", item_code: "B-GB-STD", quantity: "58.51", suggested_retail_price: "755.91", status:"Need Restock" },
    { warehouse_name: "Meycuayan", item_name: "Lamb Leg", item_code: "L-LL-WHL", quantity: "31.07", suggested_retail_price: "664.63", status: "In Stock" },
    { warehouse_name: "Bocaue", item_name: "Lamb Leg", item_code: "L-LL-WHL", quantity: "97.54", suggested_retail_price: "420.47", status: "Need Restock" },
    { warehouse_name:"Saog" ,item_name:"Salmon Fillet" ,item_code:"S-SF-SKN" ,quantity:"97.09" ,suggested_retail_price:"875.57" ,status:"Need Restock"},
    { warehouse_name:"Saog" ,item_name:"Ground Beef" ,item_code:"B-GB-STD" ,quantity:"94.94" ,suggested_retail_price:"467.28",status:"In Stock"},
    { warehouse_name:"Meycuayan" ,item_name:"Ground Beef" ,item_code:"B-GB-STD" ,quantity:"139.57" ,suggested_retail_price:"802.06", status:"Need Restock"}
];

const ALL_OPTION = 'All';

function StocksTable({ rowLimit, currentPage, onTotalDataChange, onAddProductClick, onEditStockClick, iconProps, onDeleteClick, onAddProductClose}) {
    // These values match the first item in the options array below
    const [warehouseFilter, setWarehouseFilter] = useState('warehouse');
    const [statusFilter, setStatusFilter] = useState('status');
    
    const [items, setItems] =useState([]);
    
    const fetchItems = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stock`);
            const data = await res.json();

            const normalized = data.map(item => ({
            id: item.id,
            item_name: item.item_name,
            quantity: item.quantity,
            threshold_count: item.threshold_count,
            suggested_retail_price: item.suggested_retail_price,
            selling_price:item.selling_price,
            status: item.status,
            item_code: item.item_code,

            // flatten warehouse
            warehouse_id: item.warehouse?.id ?? null,
            warehouse_name: item.warehouse?.whouse_name ?? "—",
            warehouse_address: item.warehouse?.whouse_address ?? "—",

            // keep relations if needed
            purchased_order_item: item.purchased_order_item ?? []
            }));

            setItems(normalized);
        } catch (err) {
            console.error("Failed to fetch received items", err);
        }
        };

    
    useEffect(() => {
        if (!onAddProductClose) {
            fetchItems();
        }
    }, [onAddProductClose]);

    console.log("Items",items);
    // 1. Extract Options (Strings only to match your CustomSelect components)

    // ------------------------------------------------------------------------------------------- //

        // uncomment this for the backend data fetching above to work

        const warehouseOptions = useMemo(() => {
            const unique = [...new Set(items.map(item => item.warehouse))];
            return ['warehouse', ALL_OPTION, ...unique.sort()];
        }, []);

    // ------------------------------------------------------------------------------------------- //

    //comment this for the backend data fetching above to work
    // const warehouseOptions = useMemo(() => {
    //     const unique = [...new Set(StocksData.map(item => item.warehouse))];
    //     return ['warehouse', ALL_OPTION, ...unique.sort()];
    // }, []);

    // const statusOptions = useMemo(() => {
    //     const unique = [...new Set(StocksData.map(item => item.status))];
    //     return ['status', ALL_OPTION, ...unique.sort()];
    // }, []);

// ------------------------------------------------------------------------------------------- //
    // uncomment this for the backend data fetching above to work

    const statusOptions = useMemo(() => {
        const unique = [...new Set(items.map(item => item.status))];
        return ['status', ALL_OPTION, ...unique.sort()];
    }, []);
// ------------------------------------------------------------------------------------------- //

    // 2. Filter Logic
    // const filteredData = useMemo(() => {
    //     return StocksData.filter(item => {
    //         const matchW = warehouseFilter === 'warehouse' || warehouseFilter === ALL_OPTION || item.warehouse === warehouseFilter;
    //         const matchS = statusFilter === 'status' || statusFilter === ALL_OPTION || item.status === statusFilter;
    //         return matchW && matchS;
    //     });
    // }, [StocksData,warehouseFilter, statusFilter]);

    // ------------------------------------------------------------------------------------------- //
    // THIS IS FOR THE BACKEND DATA FETCHING

    const filteredData = useMemo(() => {
        return items.filter(item => {
            const matchW = warehouseFilter === 'warehouse' || warehouseFilter === ALL_OPTION || item.warehouse_name === warehouseFilter;
            const matchS = statusFilter === 'status' || statusFilter === ALL_OPTION || item.status === statusFilter;
            return matchW && matchS;
        });
    }, [items,warehouseFilter, statusFilter]);

    // ------------------------------------------------------------------------------------------- //



    // 3. Update Parent with new total count for Pagination
    useEffect(() => {
        onTotalDataChange(filteredData.length);
    }, [filteredData.length, onTotalDataChange]);

    // 4. Slice data based on current page and row limit
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowLimit;
        return filteredData.slice(start, start + rowLimit);
    }, [filteredData, rowLimit, currentPage]);

    // ------------------------------------------------------------------------------------------ //

    //  I MOVED THIS DELETE FUNCTION TO StockManagement.jsx TO HANDLE THE MODAL THERE
    
    // const handleDeletePurchase = async (id) => {
    //     if (!confirm("Delete this stock?")) return;
    //     try {
    //         const res = await fetch(
    //         `${import.meta.env.VITE_API_URL}/api/stock/${id}`,
    //         { method: "DELETE" }
    //         );

    //         if (!res.ok) throw new Error("Delete failed");
    //         fetchItems();
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };

    // ------------------------------------------------------------------------------------------ //
    const getStatusColor = (status) => {
        switch (status) {
            case "In Stock": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "Need Restock": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        }
    };
    return (
        <div className="overflow-x-auto pb-6 mt-4 min-h-[300px]">
            {/* Filters Row */}
            <div className="flex items-center justify-between gap-3 py-2 mb-3 relative z-50">
                <div className="flex items-center gap-3">
                    <CustomWarehouseSelect
                        options={warehouseOptions} 
                        initialValue="Warehouse" 
                        onSelect={setWarehouseFilter} 
                        iconProps={iconProps}
                    />
                    <CustomStatusSelect
                        options={statusOptions} 
                        initialValue="Status" 
                        onSelect={setStatusFilter} 
                        iconProps={iconProps}
                    />
                </div>
                <button 
                    onClick={onAddProductClick} 
                    className="flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Item</span>
                </button>
            </div>

            {/* Table */}
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-200/50 dark:bg-slate-700/50 text-left">
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Warehouse</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Item Name</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Item Code</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Qty (KG)</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Unit Price</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Selling Price</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Total Value</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200 text-center">Status</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-200">Actions</th>
                    </tr>
                </thead>
                 <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                            <tr key={`${item.id}`} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-blue-500">{item.warehouse_name}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{item.item_name}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.item_code}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.suggested_retail_price}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.selling_price}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity * item.suggested_retail_price}</td>

                                <td className="p-4 text-center">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center gap-3"> 
                                    <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                        //onClick={() => onEdit(order)}
                                    >
                                        <Eye className="w-4 h-4"/>
                                    </span>
                                    <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer" onClick={() => handleDeletePurchase(item.id)}>
                                        <Trash2 className="w-4 h-4"/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                                No stocks found matching the filters.
                            </td>
                        </tr>
                    )}
                </tbody>

                {/* <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                            <tr key={`${item.id}`} className="border-b border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 text-sm font-medium text-blue-500">{item.warehouse_name}</td>
                                <td className="p-4 text-sm text-slate-800 dark:text-white">{item.item_name}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.item_code}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.suggested_retail_price}</td>
                                <td className="p-4 text-sm text-center text-slate-800 dark:text-white">{item.quantity * item.suggested_retail_price}</td>

                                <td className="p-4 text-center">
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center gap-3"> 
                                    <span className="text-sm text-blue-800 dark:text-blue-400 cursor-pointer"
                                        //onClick={() => onEdit(order)}
                                        onClick={() => onEditStockClick(item)}
                                    >
                                        <Eye className="w-4 h-4"/>
                                    </span>
                                    <span className="text-sm text-red-800 dark:text-red-400 cursor-pointer" 
                                        onClick={() => onDeleteClick(item, index)}
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                                No stocks found matching the filters.
                            </td>
                        </tr>
                    )}
                </tbody> */}
            </table>
        </div>
    );
}

export default StocksTable;
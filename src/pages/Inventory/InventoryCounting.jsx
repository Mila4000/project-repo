import React, { useState, useMemo, useEffect } from 'react';

import InventoryCountingStatsGrid from './InventoryCountingStatsGrid';
import InventoryCountingTableHeader from './InventoryCountingTableHeader';
import InventoryCountingTable from './InventoryCountingTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';

import AddCountingModal from '../../components/modals/AddCountingModal';

const ALL_OPTION = 'All';

const WarehouseData = [
    {
        Warehouse: 'Saog',
        remarks: 'Daily Counting - Jowls',
        CountingDate: 'Oct 01, 2025',
        Status: 'Approved',
    },
    {
        Warehouse: 'Meycuayan',
        remarks: 'Daily Counting - Premium Beef',
        CountingDate: 'Aug 12, 2025',
        Status: 'Approved'
    },
    {
        Warehouse: 'Quezon City',
        remarks: 'Daily Counting - Chicken',
        CountingDate: 'Sep 14, 2025',
        Status: 'Pending'
    },
    {
        Warehouse: 'Bocaue',
        remarks: 'Daily Counting - Pork',
        CountingDate: 'Oct 12, 2025',
        Status: 'Rejected'
    }
];

// --- DATE HELPER FUNCTIONS ---
const parseDate = (dateString) => {
    return new Date(dateString); 
};

const isDateInRange = (countingDateString, startDate, endDate) => {
    const transaction_date = parseDate(countingDateString);
    
    transaction_date.setHours(0, 0, 0, 0); 
    startDate.setHours(0, 0, 0, 0); 
    endDate.setHours(23, 59, 59, 999); 

    return transaction_date >= startDate && transaction_date <= endDate;
};
// ------------------------------

function InventoryCounting() {
    const iconProps = {
        className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
    };
    const [items,setItems]=useState([]);
    const fetchInventoryItem = async () =>{
        try {
             const res = await fetch("http://localhost:5000/api/inventory");
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error("Failed to display items", error)
        }
    }
    useEffect(()=>{
        fetchInventoryItem();
    },[])
    // --- DYNAMIC OPTION GENERATION (Explicitly uses ALL_OPTION) ---
    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [...new Set(items.map(order => order[key]))];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };

    const rowLimitOptions = [5, 10, 15]; 
    
    // Recalibrated Options
    const dateRangeOptions = ['Date', ALL_OPTION, 'Today', 'Last 7 Days', 'Last 30 Days'];
    const warehouseOptions = extractUniqueOptions('Warehouse', 'Warehouse');
    const statusOptions = extractUniqueOptions('Status', 'Status');

    // Recalibrated Placeholders
    const initialRowLimit = rowLimitOptions[0];
    const initialDateRange = dateRangeOptions[0];
    const initialWarehouse = warehouseOptions[0]; // New placeholder
    const initialStatus = statusOptions[0];     // New placeholder

    // --- STATE MANAGEMENT ---
    const [rowLimit, setRowLimit] = useState(initialRowLimit);
    const [dateRangeFilter, setDateRangeFilter] = useState(initialDateRange);
    const [warehouseFilter, setWarehouseFilter] = useState(initialWarehouse); // New state
    const [statusFilter, setStatusFilter] = useState(initialStatus);           // New state
    const [currentPage, setCurrentPage] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- HANDLER FUNCTIONS ---
    const handleRowLimitChange = (newValue) => {
        setRowLimit(parseInt(newValue));
        setCurrentPage(1); 
    };

    const handleDateRangeChange = (newValue) => {
        setDateRangeFilter(newValue);
        setCurrentPage(1);
    };

    const handleWarehouseChange = (newValue) => { // New handler
        setWarehouseFilter(newValue);
        setCurrentPage(1);
    };

    const handleStatusChange = (newValue) => { // New handler
        setStatusFilter(newValue);
        setCurrentPage(1);
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
        let filtered = items;
        
        // 1. Date Range Filter (Using CountingDate)
        if (dateRangeFilter !== initialDateRange && dateRangeFilter !== ALL_OPTION) {
            const today = new Date();
            let startDate = new Date(0); 

            switch (dateRangeFilter) {
                case 'Today':
                    startDate = today; 
                    break;
                case 'Last 7 Days':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 7);
                    break;
                case 'Last 30 Days':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 30);
                    break;
                default:
                    // If no case matches, assume no date filter applied for safety
                    break;
            }

            filtered = filtered.filter(order => 
                isDateInRange(order.CountingDate, startDate, today) // Use CountingDate
            );
        }

        // 2. Warehouse Filter (New Filter)
        if (warehouseFilter !== initialWarehouse && warehouseFilter !== ALL_OPTION) {
            filtered = filtered.filter(order => order.Warehouse === warehouseFilter);
        }

        // 3. Status Filter (New Filter)
        if (statusFilter !== initialStatus && statusFilter !== ALL_OPTION) {
            filtered = filtered.filter(order => order.Status === statusFilter);
        }
            
        return filtered;
    }, [items,dateRangeFilter, warehouseFilter, statusFilter, initialDateRange, initialWarehouse, initialStatus]); 

    // --- Pagination Logic ---
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);
    
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * rowLimit;
        const endIndex = startIndex + rowLimit;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, rowLimit, currentPage]);


    return (
        <div>
            <InventoryCountingStatsGrid/>
            <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-3 px-5 border border-slate-200/50 dark:border-slate-700/50">

                <InventoryCountingTableHeader
                    // Options Recalibrated
                    dateRangeOptions={dateRangeOptions} // Counting Date
                    warehouseOptions={warehouseOptions} // Warehouse
                    statusOptions={statusOptions}       // Status
                    
                    // Current Values Recalibrated
                    currentDateRange={dateRangeFilter}
                    currentWarehouse={warehouseFilter}  // Current Warehouse
                    currentStatus={statusFilter}       // Current Status

                    // Handlers Recalibrated
                    handleDateRangeChange={handleDateRangeChange}
                    handleWarehouseChange={handleWarehouseChange}
                    handleStatusChange={handleStatusChange}

                    OnAddCountingClick={handleOpenModal}
                    
                    iconProps={iconProps}
                />

                <InventoryCountingTable orders={paginatedOrders} />

                <div className = "flex items-center justify-between mb-3">
                    <RowLimiter
                        options={rowLimitOptions}
                        initialValue={rowLimit.toString()}
                        onSelect={handleRowLimitChange}
                        iconProps={iconProps}
                    />
                    <TablePagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
            <AddCountingModal
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
            />
        </div>
    );
}

export default InventoryCounting;
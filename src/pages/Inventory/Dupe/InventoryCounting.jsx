import React, { useState, useMemo, useEffect } from 'react';

import InventoryCountingStatsGrid from './InventoryCountingStatsGrid';
import InventoryCountingTableHeader from './InventoryCountingTableHeader';
import InventoryCountingTable from './InventoryCountingTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';

import AddCountingModal from '../../components/modals/AddCountingModal';
import EditCountingModal from '../../components/modals/EditCountingModal';
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal';

const ALL_OPTION = 'All';

const WarehouseData = [
    {
        warehouseID: 1,
        warehouse: 'Saog',
        remarks: 'Daily Counting - Jowls',
        count_date: 'Oct 01, 2025',
        status: 'Approved',
    },
    {
        warehouseID: 2,
        warehouse: 'Meycuayan',
        remarks: 'Daily Counting - Premium Beef',
        count_date: 'Aug 12, 2025',
        status: 'Approved'
    },
    {
        warehouseID: 3,
        warehouse: 'Quezon City',
        remarks: 'Daily Counting - Chicken',
        count_date: 'Sep 14, 2025',
        status: 'Pending'
    },
    {
        warehouseID: 4,
        warehouse: 'Bocaue',
        remarks: 'Daily Counting - Pork',
        count_date: 'Oct 12, 2025',
        status: 'Rejected'
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

    //BACKEND IMPLEMENTATION FOR FETCHING DATA FROM THE DATABASE (UNCOMMENT FOR BACKEND, COMMENT OUT FOR FRONTEND MOCKUP)
    const [items,setItems]=useState([]);
    const fetchInventoryItem = async () =>{
        try {
             const res = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory`);
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

    // const extractUniqueOptions = (key, placeholder) => {
    //     const uniqueValues = [...new Set(WarehouseData.map(order => order[key]))];
    //     return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    // };

    // ------------------------------------------------------------------------------------------- //
    //                |
    // UNCOMMENT THIS V AND COMMENT OUT THE ONE ABOVE FOR BACKEND IMPLEMENTATION. CURRENTLY SET FOR FRONTEND MOCKUP WITH WarehouseData.
    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [...new Set(items.map(order => order[key]))];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };
    // ------------------------------------------------------------------------------------------- //

    const rowLimitOptions = [5, 10, 15]; 
    
    // Recalibrated Options
    const dateRangeOptions = ['Date', ALL_OPTION, 'Today', 'Last 7 Days', 'Last 30 Days'];
    const warehouseOptions = extractUniqueOptions('warehouse', 'Warehouse');
    const statusOptions = extractUniqueOptions('status', 'Status');

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
    const [selectedCounting, setSelectedCounting] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

    // Edit Modal Handlers
    const handleOpenEditModal = (order) => {
        setSelectedCounting(order);
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCounting(null);
    };

    // Delete Modal Handlers
    const handleOpenDeleteModal = (order) => {
        setItemToDelete(order);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };


    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
        //                 vvvvvvvvvvvvv change this to "items" for BACKEND IMPLEMENTATION. Currently uses WarehouseData for FRONTEND MOCKUP.
     //   let filtered = [...WarehouseData];
      let filtered = [...items];
        
        // 1. Date Range Filter
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
                isDateInRange(order.count_date, startDate, today) // Use CountingDate
            );
        }

        // 2. Warehouse Filter (New Filter)
        if (warehouseFilter !== initialWarehouse && warehouseFilter !== ALL_OPTION) {
            filtered = filtered.filter(order => order.warehouse === warehouseFilter);
        }

        // 3. Status Filter (New Filter)
        if (statusFilter !== initialStatus && statusFilter !== ALL_OPTION) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
            
        return filtered;
    // }, [WarehouseData,dateRangeFilter, warehouseFilter, statusFilter, initialDateRange, initialWarehouse, initialStatus]); 
    //  ^^^^^^^^^^^^^
    //  | | | | | | |
}   , [items,dateRangeFilter, warehouseFilter, statusFilter, initialDateRange, initialWarehouse, initialStatus]); 
    // Use WarehouseData instead of items for FRONTEND MOCKUP. Switch to "items" for BACKEND IMPLEMENTATION.

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
                    OnEditCountingClick={handleOpenEditModal}
                    
                    iconProps={iconProps}
                />

                <InventoryCountingTable 
                    orders={paginatedOrders} 
                    OnEditCountingClick={handleOpenEditModal}
                    OnDeleteCountingClick={handleOpenDeleteModal}
                />

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
            <EditCountingModal
                isOpen={isEditModalOpen} 
                onClose={handleCloseEditModal}
                initialData={selectedCounting}
            />
            <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete ? `${itemToDelete.warehouse} | ${itemToDelete.count_date} | ${itemToDelete.remarks}` : ''}
            />
        </div>
    );
}

export default InventoryCounting;
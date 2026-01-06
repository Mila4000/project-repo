import React, { useState, useMemo, useEffect } from 'react';

import PurchasedStatsGrid from './PurchasedStatsGrid';
import PurchasedOrdersTableHeader from './PurchasedOrdersTableHeader';
import PurchasedOrdersTable from './PurchasedOrdersTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';
import AddPurchaseOrderModal from '../../components/modals/AddPurchaseOrderModal';
import EditPurchaseOrderModal from '../../components/modals/EditPurchaseOrderModal';

const ALL_OPTION = 'All';



// --- DATE HELPER FUNCTIONS ---
const parseDate = (dateString) => new Date(dateString);

const isDateInRange = (transactionDateString, startDate, endDate) => {
    const transactionDate = parseDate(transactionDateString);
    transactionDate.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return transactionDate >= start && transactionDate <= end;
};

function CreatePurchase() {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    /* =======================
    ICON PROPS
    ======================= */

    const iconProps = {
    className: "w-4 h-4 text-slate-500 dark:text-slate-500",
    };

    /* =======================
    FETCHERS
    ======================= */

    const fetchStats = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/purchasing/stats");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch purchase stats", err);
        }
    };

    const fetchPurchases = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/purchasing");
        const data = await res.json();
        setOrders(data);
    } catch (err) {
        console.error("Failed to fetch purchased orders", err);
    }
    };

    const fetchSuppliers = async () => {
    try {
        const res = await fetch("http://localhost:5000/api/supplier");
        const data = await res.json();
        setSuppliers(data);
    } catch (err) {
        console.error("Failed to fetch suppliers", err);
    }
    };

    /* =======================
    MODAL HANDLERS
    ======================= */

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleEdit = (order) => {
    setOrderToEdit(order);
    setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setOrderToEdit(null);
    };

    const handleAddNewPurchase = (newPurchase) => {
    setOrders((prev) => [...prev, newPurchase]);
    fetchPurchases();
    fetchSuppliers();
    fetchStats();
    };

    /* =======================
    FILTER OPTIONS
    ======================= */

    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [
            ...new Set(
                orders
                    .map(o => key.split('.').reduce((acc, k) => acc?.[k], o))
                    .filter(Boolean)
            )
        ];

        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };

    const rowLimitOptions = [5, 10, 15];
    const dateRangeOptions = [
    "Date Range",
    ALL_OPTION,
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    ];

    const supplierOptions = extractUniqueOptions("supplier.businessname", "Supplier");
    const deliveryOptions = extractUniqueOptions("delivery_status", "Delivery Status");
    const paymentOptions = extractUniqueOptions("payment_status", "Payment Status");
    const approvalOptions = extractUniqueOptions("approval_status", "Approval Status");

    /* =======================
    FILTER STATE
    ======================= */

    const [rowLimit, setRowLimit] = useState(rowLimitOptions[0]);
    const [dateRangeFilter, setDateRangeFilter] = useState(dateRangeOptions[0]);
    const [supplierFilter, setSupplierFilter] = useState(supplierOptions[0]);
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(deliveryOptions[0]);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(paymentOptions[0]);
    const [approvalStatusFilter, setApprovalStatusFilter] = useState(approvalOptions[0]);

    /* =======================
    FILTER HANDLERS
    ======================= */

    const resetPage = () => setCurrentPage(1);

    const handleRowLimitChange = (value) => {
    setRowLimit(parseInt(value));
    resetPage();
    };

    const handleDateRangeChange = (value) => {
    setDateRangeFilter(value);
    resetPage();
    };

    const handleSupplierChange = (value) => {
    setSupplierFilter(value);
    resetPage();
    };

    const handleDeliveryChange = (value) => {
    setDeliveryStatusFilter(value);
    resetPage();
    };

    const handlePaymentChange = (value) => {
    setPaymentStatusFilter(value);
    resetPage();
    };

    const handleApprovalChange = (value) => {
    setApprovalStatusFilter(value);
    resetPage();
    };
    
    /* =======================
    FILTERING LOGIC
    ======================= */

    const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Date Range
    if (dateRangeFilter !== dateRangeOptions[0] && dateRangeFilter !== ALL_OPTION) {
        const today = new Date();
        let startDate = new Date(today);

        if (dateRangeFilter === "Last 7 Days") {
            startDate.setDate(today.getDate() - 7);
        }

        if (dateRangeFilter === "Last 30 Days") {
            startDate.setDate(today.getDate() - 30);
        }

        filtered = filtered.filter(o =>
            isDateInRange(o.transaction_date, startDate, today)
        );
    }

    if (supplierFilter !== supplierOptions[0] && supplierFilter !== ALL_OPTION) {
        filtered = filtered.filter((o) => o.supplier?.businessname === supplierFilter);
    }

    if (approvalStatusFilter !== approvalOptions[0] && approvalStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter((o) => o.approval_status === approvalStatusFilter);
    }

    if (deliveryStatusFilter !== deliveryOptions[0] && deliveryStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter((o) => o.delivery_status === deliveryStatusFilter);
    }

    if (paymentStatusFilter !== paymentOptions[0] && paymentStatusFilter !== ALL_OPTION) {
        filtered = filtered.filter((o) => o.payment_status === paymentStatusFilter);
    }

    return filtered;
    }, [
    orders,
    supplierFilter,
    approvalStatusFilter,
    deliveryStatusFilter,
    paymentStatusFilter,
    dateRangeFilter,
    ]);

    /* =======================
    PAGINATION
    ======================= */

    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);

    const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowLimit;
    return filteredOrders.slice(start, start + rowLimit);
    }, [filteredOrders, rowLimit, currentPage]);
    console.log(paginatedOrders);
    /* =======================
    SAVE / DELETE
    ======================= */

    const handleSaveEdit = async (updatedOrder) => {
    try {
        const res = await fetch(
        `http://localhost:5000/api/purchasing/${updatedOrder.po}`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOrder),
        }
        );

        if (!res.ok) throw new Error("Failed to update purchase");

        const saved = await res.json();

        setOrders((prev) =>
        prev.map((o) => (o.po === saved.po ? saved : o))
        );
        setIsEditModalOpen(false);
        fetchPurchases();
        fetchSuppliers();
        fetchStats();
    } catch (err) {
        console.error(err);
        alert("Error updating purchase");
    }
    };

    const handleDeletePurchase = async (po) => {
    if (!confirm("Delete this purchase?")) return;

    try {
        const res = await fetch(
        `http://localhost:5000/api/purchasing/${po}`,
        { method: "DELETE" }
        );

        if (!res.ok) throw new Error("Delete failed");

        fetchPurchases();
        fetchSuppliers();
        fetchStats();
    } catch (err) {
        console.error(err);
    }
    };

    /* =======================
    INITIAL LOAD
    ======================= */

    useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchStats();
    }, []);
    
    return (
        <div>
            <PurchasedStatsGrid stats={stats}/>

            <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-5 px-5 border border-slate-200/50 dark:border-slate-700/50">

                <PurchasedOrdersTableHeader
                    dateRangeOptions={dateRangeOptions}
                    supplierOptions={supplierOptions}
                    deliveryOptions={deliveryOptions}
                    paymentOptions={paymentOptions}
                    approvalOptions={approvalOptions} // PASS NEW OPTIONS

                    currentDateRange={dateRangeFilter}
                    currentSupplier={supplierFilter}
                    currentDeliveryStatus={deliveryStatusFilter}
                    currentPaymentStatus={paymentStatusFilter}
                    currentApprovalStatus={approvalStatusFilter} // PASS NEW STATE

                    handleDateRangeChange={handleDateRangeChange}
                    handleSupplierChange={handleSupplierChange}
                    handleDeliveryChange={handleDeliveryChange}
                    handlePaymentChange={handlePaymentChange}
                    handleApprovalChange={handleApprovalChange} // PASS NEW HANDLER

                    iconProps={iconProps}
                    onAddPurchaseOrderClick={openModal}
                />

                <PurchasedOrdersTable 
                    orders={paginatedOrders} 
                    onEdit={handleEdit}
                    onDelete={handleDeletePurchase} 
                    suppliers={suppliers}
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

            {/* Add Purchase Order Modal */}
            <AddPurchaseOrderModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                onAddPurchase={handleAddNewPurchase}
            />

            {/* Edit Purchase Order Modal */}
            <EditPurchaseOrderModal 
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                orderData={orderToEdit} 
                onSave={handleSaveEdit}
            />

        </div>
    );
}

export default CreatePurchase;
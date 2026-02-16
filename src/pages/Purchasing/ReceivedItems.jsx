import React, { useState, useMemo, useEffect } from 'react';

import ReceivedStatsGrid from './ReceivedStatsGrid';
import ReceivedItemsTableHeader from './ReceivedItemsTableHeader';
import ReceivedItemsTable from './ReceivedItemsTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';
import AddReceivedItemsModal from '../../components/modals/AddReceivedItemsModal'; 
import EditReceivedItemsModal from '../../components/modals/EditReceivedItemsModal';
import ViewDeliveryReceiptModal from '../../components/modals/ViewDeliveryReceiptModal';

const ALL_OPTION = 'All';

// --- DATE HELPER FUNCTIONS ---
const parseDate = (dateString) => {
  return new Date(dateString); 
};

const isDateInRange = (transactionDateString, startDate, endDate) => {0
  const transaction_date = parseDate(transactionDateString);
  
  transaction_date.setHours(0, 0, 0, 0); 
  startDate.setHours(0, 0, 0, 0); 
  endDate.setHours(23, 59, 59, 999); 

  return transaction_date >= startDate && transaction_date <= endDate;
};
// ------------------------------

function ReceivedItems() {
  /* =========================
      STATE
  ========================= */
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
   const [dataView, setDataView] = useState([]);
   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  /* =========================
    ICON CONFIG
  ========================= */
  const iconProps = {
    className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
  };

  /* =========================
    OPTION HELPERS
  ========================= */
  const extractUniqueOptions = (key, placeholder) => {
    const uniqueValues = [...new Set(items.map(item => item[key]))];
    return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
  };

  const rowLimitOptions   = [5, 10, 15];
  const dateRangeOptions  = ['Date Range', ALL_OPTION, 'Today', 'Last 7 Days', 'Last 30 Days'];
  const supplierOptions   = extractUniqueOptions('supplier', 'Supplier');
  const deliveryOptions   = extractUniqueOptions('delivery_status', 'Delivery Status');

  /* =========================
    INITIAL FILTER VALUES
  ========================= */
  const initialRowLimit        = rowLimitOptions[0];
  const initialDateRange       = dateRangeOptions[0];
  const initialSupplier        = supplierOptions[0];
  const initialDeliveryStatus  = deliveryOptions[0];


  /* =========================
    FILTER & PAGINATION STATE
  ========================= */
  const [rowLimit, setRowLimit]                     = useState(initialRowLimit);
  const [dateRangeFilter, setDateRangeFilter]       = useState(initialDateRange);
  const [supplierFilter, setSupplierFilter]         = useState(initialSupplier);
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(initialDeliveryStatus);
  const [currentPage, setCurrentPage]               = useState(1);


  /* =========================
    MODAL STATE
  ========================= */
  const [isAddModalOpen, setIsAddModalOpen]   = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit]           = useState(null);


  /* =========================
    FILTER HANDLERS
  ========================= */
  const handleRowLimitChange = (value) => {
    setRowLimit(Number(value));
    setCurrentPage(1);
  };

  const handleDateRangeChange = (value) => {
    setDateRangeFilter(value);
    setCurrentPage(1);
  };

  const handleSupplierChange = (value) => {
    setSupplierFilter(value);
    setCurrentPage(1);
  };

  const handleDeliveryChange = (value) => {
    setDeliveryStatusFilter(value);
    setCurrentPage(1);
  };


  /* =========================
    MODAL HANDLERS
  ========================= */
  const handleOpenModal  = () => setIsAddModalOpen(true);
  const handleCloseModal = () => setIsAddModalOpen(false);


  /* =========================
    CRUD HANDLERS
  ========================= */
  const handleEdit = (item) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this received item?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/received-items/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete received item', err);
    }
  };

  const handleSaveEdit = async (updatedItem) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/received-items/${updatedItem.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem),
        }
      );

      if (!res.ok) throw new Error('Update failed');

      const savedItem = await res.json();

      setItems(prev =>
        prev.map(item => (item.id === savedItem.id ? savedItem : item))
      );

      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update received item', err);
    }
  };
      const handleView = (order) => {
        setDataView(order);
        setIsEditModalOpen(true);
    };
    const openViewModal = (order) => {
        setDataView(order);
        setIsViewModalOpen(true);
    };
    const closeViewModal = () => {
        setDataView(null);
        setIsViewModalOpen(false);
    };
  /* =========================
    FETCHING
  ========================= */
  const fetchStats = async () => {
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/received-items/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch received items stats", err);
    }
  };

  const fetchItems = async () => {
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/received-items`);
      const data = await res.json();
      const normalized = data.map(item => ({
        id: item.id,
        po_number: item.purchased_order.po,
        purchased_order_id: item.purchased_order_id,
        product_name: item.product_name,
        supplier: item.purchased_order.supplier.businessname,
        contact: item.purchased_order.supplier.contactno,
        transaction_date: item.purchased_order.transaction_date,
        delivery_status: item.purchased_order.delivery_status,
        expected_quantity: item.expected_quantity,
        quantity: item.quantity,
        remarks: item.purchased_order.remarks,
      }));

      setItems(normalized);
    } catch (err) {
      console.error("Failed to fetch received items", err);
    }
  };

  useEffect(() => {
    if (!isEditModalOpen) {
      console.log("The modal is refreshed");
      fetchItems();
      fetchStats();
    }
  }, [isEditModalOpen]);

  /* =========================
    ADD HANDLER
  ========================= */
  const handleAddReceivedItems = (newItem) => {
    setItems(prev => [...prev, ...newItem]);
    fetchItems();
    setIsAddModalOpen(false);
  };


  /* =========================
    FILTERING LOGIC
  ========================= */
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Date Range
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
      }

      filtered = filtered.filter(order =>
        isDateInRange(order.transaction_date, startDate, today)
      );
    }

    // Supplier
    if (supplierFilter !== initialSupplier && supplierFilter !== ALL_OPTION) {
      filtered = filtered.filter(order => order.supplier === supplierFilter);
    }

    // Delivery Status
    if (
      deliveryStatusFilter !== initialDeliveryStatus &&
      deliveryStatusFilter !== ALL_OPTION
    ) {
      filtered = filtered.filter(
        order => order.delivery_status === deliveryStatusFilter
      );
    }

    return filtered;
  }, [
    items,
    dateRangeFilter,
    supplierFilter,
    deliveryStatusFilter,
    initialDateRange,
    initialSupplier,
    initialDeliveryStatus,
  ]);


  /* =========================
    PAGINATION
  ========================= */
  const totalOrders = filteredItems.length;
  const totalPages  = Math.ceil(totalOrders / rowLimit);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * rowLimit;
    const end   = start + rowLimit;
    return filteredItems.slice(start, end);
  }, [filteredItems, rowLimit, currentPage]);
  return (
    <div>
      <ReceivedStatsGrid stats={stats} />
      <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-3 px-5 border border-slate-200/50 dark:border-slate-700/50">

        <ReceivedItemsTableHeader
          dateRangeOptions={dateRangeOptions}
          supplierOptions={supplierOptions}
          deliveryOptions={deliveryOptions}
          
          currentDateRange={dateRangeFilter}
          currentSupplier={supplierFilter}
          currentDeliveryStatus={deliveryStatusFilter}

          handleDateRangeChange={handleDateRangeChange}
          handleSupplierChange={handleSupplierChange}
          handleDeliveryChange={handleDeliveryChange}

          onAddReceivedItemClick={() => setIsAddModalOpen(true)}
          
          iconProps={iconProps}
        />

        <ReceivedItemsTable 
        orders={paginatedOrders}
        onView={handleView}
        onViewReceipt={openViewModal} 
        onDelete={handleDelete} />

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

        <AddReceivedItemsModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddItem={handleAddReceivedItems} />
        
        <EditReceivedItemsModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            itemData={dataView}
            onSave={handleSaveEdit}
        />
        <ViewDeliveryReceiptModal
            isOpen={isViewModalOpen}
            onClose={closeViewModal}
            displayData={dataView}
            transactType="purchasing"
        />
    </div>
  );
}

export default ReceivedItems;
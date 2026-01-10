import React, { useState, useMemo, useEffect } from 'react';

import SalesInvoiceStatsGrid from './SalesInvoiceStatsGrid';
import SalesInvoiceTableHeader from './SalesInvoiceTableHeader';
import SalesInvoiceTable from './SalesInvoiceTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';

import CreateInvoiceModal from '../../components/modals/CreateInvoiceModal';
import EditSalesInvoiceModal from '../../components/modals/EditSalesInvoiceModal';
import ViewReceiptModal from '../../components/modals/ViewReceiptModal';

const ALL_OPTION = 'All';

const SalesData = [
  {
    PO: 'PO-123456',
    supplier: 'Earl Meats',
    transaction_date: 'Sep 21, 2025',
    deliveryDate: 'Sep 25, 2025',
    total: '$1,234.56',
    approvalStatus: 'Pending',
    deliveryStatus: 'Out for Delivery',
    paymentStatus: 'N/A',
    remarks: 'Chicken Restock',
  },
  {
    PO: 'PO-135790',
    supplier: 'Javier Meats',
    transaction_date: 'Sep 12, 2025',
    deliveryDate: 'Sep 20, 2025',
    total: '$1,900.25',
    approvalStatus: 'Approved',
    deliveryStatus: 'Delivered',
    paymentStatus: 'Paid',
    remarks: 'Beef Jowls x10',
  },
  {
    PO: 'PO-24681',
    supplier: 'Betez Trading',
    transaction_date: 'Sep 11, 2025',
    deliveryDate: 'Sep 19, 2025',
    total: '$2,100.15',
    approvalStatus: 'Rejected',
    deliveryStatus: 'Order Placed',
    paymentStatus: 'Unpaid',
    remarks: 'Supply for Saog',
  },
  {
    PO: "PO-987654",
    supplier: "Global Foods Inc.",
    transaction_date: "Dec 05, 2025",
    deliveryDate: "Dec 10, 2025",
    total: "$5,432.10",
    approvalStatus: "Approved",
    deliveryStatus: "Delivered",
    paymentStatus: "Paid",
    remarks: "Urgent shipment of grain"
  },
  {
    PO: "PO-001122",
    supplier: "Reyes Farms",
    transaction_date: "Nov 28, 2025",
    deliveryDate: "Dec 01, 2025",
    total: "$850.75",
    approvalStatus: "Pending",
    deliveryStatus: "Out for Delivery",
    paymentStatus: "N/A",
    remarks: "Fruit and vegetable stock"
  },
  {
    PO: "PO-765432",
    supplier: "Fresh Produce Co.",
    transaction_date: "Dec 09, 2025",
    deliveryDate: "Dec 11, 2025",
    total: "$450.00",
    approvalStatus: "Pending",
    deliveryStatus: "Order Placed",
    paymentStatus: "Unpaid",
    remarks: "Urgent lettuce and tomato order"
  },
  {
    PO: "PO-981234",
    supplier: "Betez Trading",
    transaction_date: "Nov 30, 2025",
    deliveryDate: "Dec 05, 2025",
    total: "$1,999.99",
    approvalStatus: "Approved",
    deliveryStatus: "Delivered",
    paymentStatus: "Paid",
    remarks: "Kitchen equipment maintenance parts"
  },
  {
    PO: "PO-345678",
    supplier: "Central Dairy Inc.",
    transaction_date: "Dec 02, 2025",
    deliveryDate: "Dec 02, 2025",
    total: "$675.30",
    approvalStatus: "Approved",
    deliveryStatus: "Out for Delivery",
    paymentStatus: "N/A",
    remarks: "Milk and cheese rush order"
  },
  {
    PO: "PO-210987",
    supplier: "Earl Meats",
    transaction_date: "Oct 15, 2025",
    deliveryDate: "Oct 20, 2025",
    total: "$5,200.70",
    approvalStatus: "Rejected",
    deliveryStatus: "Delivered",
    paymentStatus: "Unpaid",
    remarks: "Order rejected due to quality issue"
  },
  {
    PO: "PO-556677",
    supplier: "Global Foods Inc.",
    transaction_date: "Nov 18, 2025",
    deliveryDate: "Nov 23, 2025",
    total: "$1,250.40",
    approvalStatus: "Pending",
    deliveryStatus: "Order Placed",
    paymentStatus: "Paid",
    remarks: "Canned goods restock"
  },
  {
    PO: "PO-112233",
    supplier: "Javier Meats",
    transaction_date: "Dec 06, 2025",
    deliveryDate: "Dec 10, 2025",
    total: "$3,800.10",
    approvalStatus: "Approved",
    deliveryStatus: "Out for Delivery",
    paymentStatus: "N/A",
    remarks: "Holiday beef tenderloin order"
  },
  {
    PO: "PO-889900",
    supplier: "Reyes Farms",
    transaction_date: "Oct 25, 2025",
    deliveryDate: "Oct 28, 2025",
    total: "$580.95",
    approvalStatus: "Approved",
    deliveryStatus: "Delivered",
    paymentStatus: "Paid",
    remarks: "Seasonal squash and pumpkin"
  },
  {
    PO: "PO-404040",
    supplier: "Fresh Produce Co.",
    transaction_date: "Nov 01, 2025",
    deliveryDate: "Nov 03, 2025",
    total: "$710.25",
    approvalStatus: "Pending",
    deliveryStatus: "Out for Delivery",
    paymentStatus: "Unpaid",
    remarks: "Weekly fruit basket delivery"
  },
  {
    PO: "PO-606060",
    supplier: "Central Dairy Inc.",
    transaction_date: "Sep 05, 2025",
    deliveryDate: "Sep 07, 2025",
    total: "$990.00",
    approvalStatus: "Rejected",
    deliveryStatus: "Order Placed",
    paymentStatus: "N/A",
    remarks: "Cream shortage notification"
  },
  {
    PO: "PO-707070",
    supplier: "Earl Meats",
    transaction_date: "Dec 07, 2025",
    deliveryDate: "Dec 07, 2025",
    total: "$2,150.00",
    approvalStatus: "Approved",
    deliveryStatus: "Delivered",
    paymentStatus: "Paid",
    remarks: "Last minute catering order"
  }
];

const parseDate = (dateString) => {
  return new Date(dateString); 
};

const isDateInRange = (transactionDateString, startDate, endDate) => {
  const transaction_date = parseDate(transactionDateString);
  
  transaction_date.setHours(0, 0, 0, 0); 
  startDate.setHours(0, 0, 0, 0); 
  endDate.setHours(23, 59, 59, 999); 

  return transaction_date >= startDate && transaction_date <= endDate;
};

function CreateSalesInvoice() {
    const iconProps = {
      className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
    };
    
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    // --- ADD MODAL STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // --- EDIT MODAL STATE ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [orderToEdit, setOrderToEdit] = useState(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const openViewModal = () => setIsViewModalOpen(true);
    const closeViewModal = () => setIsViewModalOpen(false);

    const extractUniqueOptions = (key, placeholder) => {
      const uniqueValues = [...new Set(orders.map(order => order[key]))];
      return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };
    const fetchPurchases = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/purchasing`);
        const data = await res.json();
        setOrders(data);
    } catch (err) {
        console.error("Failed to fetch purchased orders", err);
    }
    };

    const fetchSuppliers = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/supplier`);
        const data = await res.json();
        setSuppliers(data);
    } catch (err) {
        console.error("Failed to fetch suppliers", err);
    }
    };


    const rowLimitOptions = [5, 10, 15]; 
    
    const dateRangeOptions = ['Date Range', ALL_OPTION, 'Today', 'Last 7 Days', 'Last 30 Days'];
    
    const supplierOptions = extractUniqueOptions('supplier', 'Supplier');
    const deliveryOptions = extractUniqueOptions('deliveryStatus', 'Delivery Status');
    const paymentOptions = extractUniqueOptions('paymentStatus', 'Payment Status');
    const approvalOptions = extractUniqueOptions('approvalStatus', 'Approval Status'); // NEW OPTIONS

    //the placeholder
    const initialRowLimit = rowLimitOptions[0];
    const initialDateRange = dateRangeOptions[0];
    const initialSupplier = supplierOptions[0];
    const initialDeliveryStatus = deliveryOptions[0];
    const initialPaymentStatus = paymentOptions[0];
    const initialApprovalStatus = approvalOptions[0]; // NEW INITIAL STATE
    

    // --- STATE MANAGEMENT ---
    const [rowLimit, setRowLimit] = useState(initialRowLimit);
    const [dateRangeFilter, setDateRangeFilter] = useState(initialDateRange);
    const [supplierFilter, setSupplierFilter] = useState(initialSupplier);
    const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(initialDeliveryStatus);
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(initialPaymentStatus);
    const [approvalStatusFilter, setApprovalStatusFilter] = useState(initialApprovalStatus); // NEW STATE
    const [currentPage, setCurrentPage] = useState(1);

    // --- HANDLER FUNCTIONS ---
    const handleRowLimitChange = (newValue) => {
      setRowLimit(parseInt(newValue));
      setCurrentPage(1); 
    };

    const handleDateRangeChange = (newValue) => {
      setDateRangeFilter(newValue);
      setCurrentPage(1);
    };

    const handleSupplierChange = (newValue) => {
      setSupplierFilter(newValue);
      setCurrentPage(1);
    };

    const handleDeliveryChange = (newValue) => {
      setDeliveryStatusFilter(newValue);
      setCurrentPage(1);
    };

    const handlePaymentChange = (newValue) => {
      setPaymentStatusFilter(newValue);
      setCurrentPage(1);
    };

    const handleApprovalChange = (newValue) => { // NEW HANDLER
      setApprovalStatusFilter(newValue);
      setCurrentPage(1);
    };

    // --- EDIT HANDLER ---
    const handleEdit = (orderData) => {
      setOrderToEdit(orderData); 
      setIsEditModalOpen(true); 
    };

    const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setOrderToEdit(null); 
    };

    const handleSaveEdit = (updatedOrder) => {
      handleCloseEditModal();
    };

    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
      let filtered = orders;
      
      // 1. Date Range Filter
      // Only apply if the value is NOT the placeholder AND NOT 'All'
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

      // Supplier Filter
      if (supplierFilter !== initialSupplier && supplierFilter !== ALL_OPTION) {
          filtered = filtered.filter(order => order.supplier === supplierFilter);
      }

      // Approval Status Filter (NEW FILTER LOGIC)
      if (approvalStatusFilter !== initialApprovalStatus && approvalStatusFilter !== ALL_OPTION) {
          filtered = filtered.filter(order => order.approvalStatus === approvalStatusFilter);
      }

      // Delivery Status Filter
      if (deliveryStatusFilter !== initialDeliveryStatus && deliveryStatusFilter !== ALL_OPTION) {
          filtered = filtered.filter(order => order.deliveryStatus === deliveryStatusFilter);
      }

      // Payment Status Filter
      if (paymentStatusFilter !== initialPaymentStatus && paymentStatusFilter !== ALL_OPTION) {
          filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
      }
        
        return filtered;
    }, [orders, dateRangeFilter, supplierFilter, approvalStatusFilter, deliveryStatusFilter, paymentStatusFilter, initialDateRange, initialSupplier, initialApprovalStatus, initialDeliveryStatus, initialPaymentStatus]); 

    // --- Pagination Logic ---
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);
    
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * rowLimit;
        const endIndex = startIndex + rowLimit;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, rowLimit, currentPage]);

    useEffect(() => {
      fetchPurchases();
      fetchSuppliers();
    }, []);

  return (
    <div>
      <SalesInvoiceStatsGrid />
      <div className = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">
        
        <SalesInvoiceTableHeader
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

        <SalesInvoiceTable 
          orders={paginatedOrders}
          onEdit={handleEdit}
          onViewReceipt={openViewModal}
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


      <CreateInvoiceModal
          isOpen={isModalOpen} 
          onClose={closeModal} 
      />


      <EditSalesInvoiceModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          orderData={orderToEdit} 
          onSave={handleSaveEdit}
      />
      
      <ViewReceiptModal
          isOpen={isViewModalOpen}
          onClose={closeViewModal}
      />
    </div>
  )
}

export default CreateSalesInvoice;

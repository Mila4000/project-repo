import React, { useState, useEffect, useMemo } from 'react';

import SupplierStatsGrid from './SupplierStatsGrid';
import SupplierListTable from './SupplierListTable';
import SupplierListTableHeader from './SupplierListTableHeader';
import TablePagination from '../../components/pagination/TablePagination';
import RowLimiter from '../../components/filter/RowLimiter';

import AddSupplierModal from '../../components/modals/AddSupplierModal'; 
import EditSupplierListModal from '../../components/modals/EditSupplierListModal';

const ALL_OPTION = 'All';

function SupplierList() {
  const iconProps = {
    className: "w-4 h-4 text-slate-500 dark:text-slate-500",
  };

  // -------------------- STATE --------------------
  const [stats, setStats] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Filters
  const rowLimitOptions = [5, 10, 15];
  const ALL_OPTION = "All";

  const [rowLimit, setRowLimit] = useState(rowLimitOptions[0]);
  const [nameFilter, setNameFilter] = useState("Name");
  const [businessNameFilter, setBusinessNameFilter] = useState("Business Name");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  // -------------------- DATA FETCHING --------------------
  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier`);
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    }
  };

  const fetchSupplierStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/supplier/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch supplier stats", err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchSupplierStats();
  }, []);

  // -------------------- OPTIONS --------------------
  const extractUniqueOptions = (key, placeholder) => {
    const uniqueValues = [
      ...new Set(suppliers.map((supplier) => supplier[key])),
    ];

    return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
  };

  const nameOptions = extractUniqueOptions("name", "Name");
  const businessNameOptions = extractUniqueOptions(
    "businessname",
    "Business Name"
  );
  const statusOptions = extractUniqueOptions("status", "Status");

  // -------------------- HANDLERS --------------------
  const handleRowLimitChange = (value) => {
    setRowLimit(Number(value));
    setCurrentPage(1);
  };

  // Edit
  const handleOpenEditModal = (supplier) => {
    setSupplierToEdit(supplier);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSupplierToEdit(null);
  };

  const handleSaveEdit = async (updatedSupplier) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/supplier/${updatedSupplier.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSupplier),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const savedSupplier = await res.json();

      setSuppliers((prev) =>
        prev.map((s) => (s.id === savedSupplier.id ? savedSupplier : s))
      );
      
      fetchSupplierStats();
      fetchSuppliers();
      handleCloseEditModal();
    } catch (err) {
      console.error("Failed to update supplier", err);
    }
  };

  // Delete
  const handleDeleteSupplier = async (id) => {
    if (!confirm("Delete this supplier?")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/supplier/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      fetchSupplierStats();
      fetchSuppliers();
    } catch (err) {
      console.error("Failed to delete supplier", err);
    }
  };

  // Add
  const handleAddSupplier = (newSupplier) => {
    setSuppliers((prev) => [...prev, newSupplier]);
    fetchSupplierStats();
    fetchSuppliers();
  };

  // -------------------- FILTERING --------------------
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      if (nameFilter !== "Name" && nameFilter !== ALL_OPTION) {
        if (supplier.name !== nameFilter) return false;
      }

      if (
        businessNameFilter !== "Business Name" &&
        businessNameFilter !== ALL_OPTION
      ) {
        if (supplier.businessname !== businessNameFilter) return false;
      }

      if (statusFilter !== "Status" && statusFilter !== ALL_OPTION) {
        if (supplier.status !== statusFilter) return false;
      }

      return true;
    });
  }, [suppliers, nameFilter, businessNameFilter, statusFilter]);

  // -------------------- PAGINATION --------------------
  const totalPages = Math.ceil(filteredSuppliers.length / rowLimit);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowLimit;
    return filteredSuppliers.slice(startIndex, startIndex + rowLimit);
  }, [filteredSuppliers, rowLimit, currentPage]);

  return (
    <div>
      <SupplierStatsGrid stats={stats} />
      <div className="bg-white/80 space-y-5 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">

        <SupplierListTableHeader
          nameOptions={nameOptions}
          businessNameOptions={businessNameOptions}
          statusOptions={statusOptions}
          currentName={nameFilter}
          currentBusinessName={businessNameFilter}
          currentStatus={statusFilter}
          
          // Update these three lines to use setters directly
          handleNameChange={setNameFilter}
          handleBusinessNameChange={setBusinessNameFilter}
          handleStatusChange={setStatusFilter} 
          
          onAddSupplierClick={() => setIsAddModalOpen(true)} 
          iconProps={iconProps}
        />

        <SupplierListTable 
            suppliers={paginatedSuppliers} 
            onEdit={handleOpenEditModal} 
            onDelete={handleDeleteSupplier}
        />

        <div className="flex items-center justify-between mb-3">
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
      
      <AddSupplierModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddSupplier={handleAddSupplier}
      />

      <EditSupplierListModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        supplierData={supplierToEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default SupplierList;
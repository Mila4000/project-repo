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
    className: 'w-4 h-4 text-slate-500 dark:text-slate-500',
  };
  const [stats,setStats] = useState([]);
  const [suppliers,setSuppliers] = useState([]);

  useEffect(() => {
      const fetchSuppliers = async () => {
          try {
          const response = await fetch("http://localhost:5000/api/supplier");
          const data = await response.json();
          setSuppliers(data);
          } catch (err) {
          console.error("Failed to fetch suppliers", err);
          }
      };
  
      fetchSuppliers();
      }, []);
  useEffect(() => {
      const fetchSupplierStats = async () => {
          try {
          const response = await fetch("http://localhost:5000/api/supplier/stats");
          const data = await response.json();
          setStats(data);
          } catch (err) {
          console.error("Failed to fetch suppliers", err);
          }
      };
  
      fetchSupplierStats();
      }, []);
  // --- OPTION GENERATION ---
  const extractUniqueOptions = (key, placeholder) => {
    const uniqueValues = [...new Set(suppliers.map(supplier => supplier[key]))];
    return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
  };
  
  const rowLimitOptions = [5, 10, 15]; 
  const nameOptions = extractUniqueOptions('name', 'Name');
  const businessNameOptions = extractUniqueOptions('businessname', 'Business Name');
  const statusOptions = extractUniqueOptions('status', 'Status');

  const initialRowLimit = rowLimitOptions[0];
  const initialName = nameOptions[0];
  const initialBusinessName = businessNameOptions[0];
  const initialStatus = statusOptions[0];

  // --- STATE MANAGEMENT ---
  const [rowLimit, setRowLimit] = useState(initialRowLimit);
  const [nameFilter, setNameFilter] = useState(initialName);
  const [businessNameFilter, setBusinessNameFilter] = useState(initialBusinessName);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [currentPage, setCurrentPage] = useState(1);
  
  // --- MODAL STATES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [supplierToEdit, setSupplierToEdit] = useState(null);

  // --- HANDLER FUNCTIONS ---
  const handleRowLimitChange = (newValue) => {
    setRowLimit(parseInt(newValue));
    setCurrentPage(1); 
  };

  // Edit Handlers
  const handleOpenEditModal = (supplierData) => {
    setSupplierToEdit(supplierData);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSupplierToEdit(null);
  };
  // Save Edited Supplier
  const handleSaveEdit = async (updatedSupplier) => {
    console.log("Updated Supplier:", updatedSupplier); // For debugging
    const id = updatedSupplier.id;
    try{
      const response = await fetch(`http://localhost:5000/api/supplier/${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSupplier),
      });
      if (!response.ok) {
          throw new Error("Network response was not ok");
      }
      const savedSupplier = await response.json();
      setSuppliers(prevSuppliers => prevSuppliers.map(s => s.id === savedSupplier.id ? savedSupplier : s));
      handleCloseEditModal();
    }
    catch(error){
      console.error("Failed to update supplier", error);
    }
  };

  //Delete Handler
  // --- DELETE HANDLER ---
  const handleDeleteSupplier = async (id) => {
      if (!confirm("Delete this supplier?")) return;

      try {
          const res = await fetch(
          `http://localhost:5000/api/supplier/${id}`,
          { method: "DELETE" }
          );

          if (!res.ok) throw new Error("Delete failed");

          // ✅ REFRESH DATA
          await fetchSuppliers();
      } catch (err) {
          console.error(err);
      }
  };
  //Refresh Data
  const fetchSuppliers= async () => {
          const res = await fetch("http://localhost:5000/api/supplier");
          const data = await res.json();
          setSuppliers(data);
      };
      useEffect(() => {
          fetchSuppliers();
      }, []);
  // Add Supplier Handler
  const handleAddSupplier = (newSupplier) => {
    setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
  }

  // --- FILTERING LOGIC ---
  const filteredSuppliers = useMemo(() => {
    let filtered = suppliers; 

    if (nameFilter !== initialName && nameFilter !== ALL_OPTION) {
      filtered = filtered.filter(s => s.Name === nameFilter);
    }
    if (businessNameFilter !== initialBusinessName && businessNameFilter !== ALL_OPTION) {
      filtered = filtered.filter(s => s.businessName === businessNameFilter);
    }
    if (statusFilter !== initialStatus && statusFilter !== ALL_OPTION) {
      filtered = filtered.filter(s => s.Status === statusFilter);
    }

    return filtered;
  }, [suppliers,nameFilter, businessNameFilter, statusFilter, initialName, initialBusinessName, initialStatus]); 

  // --- PAGINATION LOGIC ---
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
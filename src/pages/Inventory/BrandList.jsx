import React, { useState, useMemo, use, useEffect } from 'react';

import BrandListStatsGrid from './BrandListGrid';
import BrandListTableHeader from './BrandListTableHeader';
import BrandListTable from './BrandListTable';
import TablePagination from '../../components/pagination/TablePagination';
import RowLimiter from '../../components/filter/RowLimiter';

import AddBrandModal from '../../components/modals/AddBrandModal';

const ALL_OPTION = 'All';


function BrandList() {
    const iconProps = { className: 'w-4 h-4 text-slate-500 dark:text-slate-500' };
    const [orders, setOrders] = useState([]);
    const [stats,setStats] = useState([]);
    const fetchBrands = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory/brands`);
        const data = await res.json();

        setOrders(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    const fetchStats = async () => {
    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/inventory/brands/stats`);
        const data = await res.json();
        setStats(data);
    } catch (err) {
        console.error("Failed to fetch brand stats", err);
    }
    };
    // --- DYNAMIC OPTION GENERATION ---
    const extractUniqueOptions = (key, placeholder) => {
        const uniqueValues = [...new Set(orders.map(brand => brand[key]))];
        return [placeholder, ALL_OPTION, ...uniqueValues.sort()];
    };

    const rowLimitOptions = [5, 10, 15];
    const nameOptions = extractUniqueOptions('name', 'Name');

    const initialRowLimit = rowLimitOptions[0];
    const initialName = nameOptions[0];

    // --- STATE MANAGEMENT ---
    const [rowLimit, setRowLimit] = useState(initialRowLimit);
    const [nameFilter, setNameFilter] = useState(initialName);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [brandToEdit, setBrandToEdit] = useState(null);

    // --- HANDLER FUNCTIONS ---
    const handleRowLimitChange = (newValue) => {
        setRowLimit(parseInt(newValue));
        setCurrentPage(1);
    };

    const handleNameChange = (newValue) => {
        setNameFilter(newValue);
        setCurrentPage(1);
    };

    // Edit Logic
    const handleEditClick = (brand) => {
        setBrandToEdit(brand);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async(updatedData) => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/brands/${updatedData.id}`,
            {
              method:"PUT",
              headers:{
                "Content-Type":
                "application/json"
              },
              body: JSON.stringify(updatedData),
            }
          );
          if (!res.ok) throw new Error("Failed to update brand");
          const saved = await res.json();

          setOrders(
            (prev)=>
              prev.map((brand) => brand.id === saved.id? saved : brand)
          );
          setIsEditModalOpen(false);
          fetchBrands();
        } catch (error) {
          console.error(error);
          alert("Error updating brand");
        }
    };
    const handleDelete = async(id)=>{
      if (!confirm("Delete this brand?")) return;

      try {
          const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/brands/${id}`,
          { method: "DELETE" }
          );

          if (!res.ok) throw new Error("Delete failed");

          fetchBrands();
      } catch (err) {
          console.error(err);
      }
    };

    // --- FILTERING LOGIC ---
    const filteredOrders = useMemo(() => {
        let filtered = orders;
        if (nameFilter !== initialName && nameFilter !== ALL_OPTION) {
            filtered = filtered.filter(brand => brand.name === nameFilter);
        }
        return filtered;
    }, [orders, nameFilter, initialName]);
    

    useEffect(() => {
      fetchBrands();
      fetchStats();
    }, []);
    // --- PAGINATION LOGIC ---
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / rowLimit);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * rowLimit;
        return filteredOrders.slice(startIndex, startIndex + rowLimit);
    }, [filteredOrders, rowLimit, currentPage]);
    return (
      <div>
          <BrandListStatsGrid stats={stats}/>
          <div className="space-y-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50">
              
          <BrandListTableHeader 
            nameOptions={nameOptions}
            currentName={nameFilter}
            handleNameChange={handleNameChange}
            iconProps={iconProps}
            onBrandAdd={() => setIsAddModalOpen(true)}
          />

          <BrandListTable 
            orders={paginatedOrders} 
            onEdit={handleEditClick} 
            onDelete={handleDelete}
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

        {/* Modals */}
        <AddBrandModal
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </div>
    );
}

export default BrandList;
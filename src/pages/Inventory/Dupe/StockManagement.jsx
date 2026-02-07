import React, { useState, useEffect, useCallback } from 'react';
import StockStatsGrid from './StockStatsGrid';
import StocksTable from './StocksTable';
import StocksTransferTable from './StocksTransferTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';
import AddProductModal from '../../components/modals/AddProductModal';
import AddStockTransferModal from '../../components/modals/AddStockTransferModal';
import EditStockDetailsModal from '../../components/modals/EditStockDetailsModal';
import EditStockTransferDetailsModal from '../../components/modals/EditStockTransferDetailsModal';
import DeleteConfirmModal from '../../components/modals/DeleteConfirmModal';

function StockManagement() {
    const [activeTab, setActiveTab] = useState('profile');
    const [stats, setStats] = useState([]);
    
    // --- MODAL STATES ---
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isAddTransferModalOpen, setIsAddTransferModalOpen] = useState(false);
    const [isEditStockDetailsModalOpen, setIsEditStockDetailsModalOpen] = useState(false);
    const [isEditTransferDetailsModalOpen, setIsEditTransferDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
    const [selectedStock, setSelectedStock] = useState(null);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [itemIndex, setItemIndex] = useState(null);

    // --- PAGINATION & SHARED STATE ---
    const [rowLimit, setRowLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.ceil(totalItems / rowLimit);
    const iconProps = { className: 'w-4 h-4 text-slate-500 dark:text-slate-500' };

    const fetchStats = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/stock/stats");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch purchase stats", err);
        }
    };

    useEffect(() => {
        if (!isAddProductModalOpen) {
            fetchStats();
        }
    }, [isAddProductModalOpen]);

    const handleDataChange = useCallback((count) => {
        setTotalItems(count);
        setCurrentPage(1); 
    }, []);

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    const getTabClasses = (tabId) => 
        activeTab === tabId 
            ? "inline-block p-4 border-b-2 border-blue-500 text-blue-500 font-semibold cursor-pointer hover:text-blue-600 hover:border-blue-600"
            : "inline-block p-4 border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-blue-500 hover:border-blue-300 cursor-pointer";

    // --- HANDLERS ---
    const handleEditClick = (item) => {
        setSelectedStock(item);
        setIsEditStockDetailsModalOpen(true);
    };

    const handleEditTransferModalClick = (item) => {
        setSelectedStock(item);
        setIsEditTransferDetailsModalOpen(true);
    };

    const handleDeleteClick = (item, index) => {
        setItemToDelete(item);
        setItemIndex(index + 1 + (currentPage - 1) * rowLimit);
        setIsDeleteModalOpen(true);
    };

    // const handleConfirmDelete = async () => {
    //     // Logic for backend deletion goes here
    //     console.log("Deleting item:", itemToDelete);
    //     setIsDeleteModalOpen(false);
    //     setItemToDelete(null);
    // };

    // ------------------------------------------------------------------------------------------ //
    // DELETE FUNCTION MOVED FROM StocksTable.jsx TO HERE TO HANDLE THE MODAL

        const handleConfirmDelete = async () => {
            if (!itemToDelete) return;
            try {
                // Keep your backend logic exactly as it was
                const res = await fetch(
                    `http://localhost:5000/api/stock/${itemToDelete.id}`,
                    { method: "DELETE" }
                );

                if (!res.ok) throw new Error("Delete failed");
                
                // Re-fetch stats or items to refresh UI
                fetchStats(); 
                
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
                setItemIndex(null);
            } catch (err) {
                console.error("Delete Error:", err);
            }
        };

    // ------------------------------------------------------------------------------------------ //

    return (
        <div>
            <StockStatsGrid stats={stats}/>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <h1 className="p-2 text-[#535353] dark:text-white text-2xl font-bold">Item List</h1>

                <div>
                    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                            <li className="me-2">
                                <button onClick={() => handleTabClick('profile')} className={getTabClasses('profile')} type="button">
                                    Stocks
                                </button>
                            </li>
                            <li className="me-2">
                                <button onClick={() => handleTabClick('dashboard')} className={getTabClasses('dashboard')} type="button">
                                    Stocks Transfer
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div id="default-tab-content">
                        {activeTab === 'profile' && (
                            <div id="profile">
                                <StocksTable 
                                    rowLimit={rowLimit}
                                    currentPage={currentPage}
                                    onTotalDataChange={handleDataChange}
                                    onAddProductClick={() => setIsAddProductModalOpen(true)}
                                    iconProps={iconProps}
                                    onEditStockClick={handleEditClick}
                                    onDeleteClick={handleDeleteClick}
                                />
                            </div>
                        )}

                        {activeTab === 'dashboard' && (
                            <div id="dashboard">
                                <StocksTransferTable 
                                    rowLimit={rowLimit}
                                    currentPage={currentPage}
                                    onTotalDataChange={handleDataChange}
                                    onAddStockTransferClick={() => setIsAddTransferModalOpen(true)}
                                    iconProps={iconProps}
                                    onEditStockTransferClick={handleEditTransferModalClick}
                                    OnDeleteCountingClick={handleDeleteClick} 
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <RowLimiter
                        options={[5, 10, 15]}
                        initialValue={rowLimit.toString()}
                        onSelect={(val) => { setRowLimit(parseInt(val)); setCurrentPage(1); }}
                        iconProps={iconProps}
                    />
                    <TablePagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            <AddProductModal isOpen={isAddProductModalOpen} onClose={() => setIsAddProductModalOpen(false)} />
            <AddStockTransferModal isOpen={isAddTransferModalOpen} onClose={() => setIsAddTransferModalOpen(false)} />
            
            <EditStockDetailsModal
                isOpen={isEditStockDetailsModalOpen}
                onClose={() => { setIsEditStockDetailsModalOpen(false); setSelectedStock(null); }}
                initialData={selectedStock}
            />
            <EditStockTransferDetailsModal
                isOpen={isEditTransferDetailsModalOpen}
                onClose={() => { setIsEditTransferDetailsModalOpen(false); setSelectedStock(null); }}
                initialData={selectedStock}
            />


            {/* OLD DELETE CONFIRM MODAL  */}
            {/* <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                // front-end mockup display
                itemName={itemToDelete ? `${itemToDelete.id} | ${itemToDelete.Sender} | ${itemToDelete.Remarks} | ${itemToDelete.TotalQuantity} kg | ${itemToDelete.TotalValue}` : ''}
            /> */}


            {/* NEW DELETE CONFIRM MODAL WITH INDEX DISPLAY */}
            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setItemToDelete(null); }}
                onConfirm={handleConfirmDelete}
                itemName={
                    itemToDelete 
                        ? itemToDelete.Sender 
                            ? `Row #${itemIndex} | ${itemToDelete.Sender} | ${itemToDelete.Remarks} | ${itemToDelete.TotalQuantity} kg`
                            : `Row #${itemIndex} | ${itemToDelete.item_code} | ${itemToDelete.item_name} | ${itemToDelete.quantity} kg`
                        : ''
                }
            />
        </div>
    );
}

export default StockManagement;
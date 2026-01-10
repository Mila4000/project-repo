import React, { useState,useEffect, useCallback } from 'react';
import StockStatsGrid from './StockStatsGrid';
import StocksTable from './StocksTable';
import StocksTransferTable from './StocksTransferTable';
import RowLimiter from '../../components/filter/RowLimiter';
import TablePagination from '../../components/pagination/TablePagination';
import AddProductModal from '../../components/modals/AddProductModal';
import AddStockTransferModal from '../../components/modals/AddStockTransferModal';

function StockManagement() {
    const [activeTab, setActiveTab] = useState('profile');
    const [stats, setStats]= useState([]);
     // --- MODAL STATES ---
   
   const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isAddTransferModalOpen, setIsAddTransferModalOpen] = useState(false);
    
    // --- PAGINATION & SHARED STATE ---
    const [rowLimit, setRowLimit] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.ceil(totalItems / rowLimit);
    const iconProps = { className: 'w-4 h-4 text-slate-500 dark:text-slate-500' };


     
    const fetchStats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stock/stats`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to fetch purchase stats", err);
        }
    };
    useEffect(() => {
        if(!isAddProductModalOpen){
        fetchStats();
    }}, [isAddProductModalOpen]);

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

    return (
        <div>
            <StockStatsGrid stats={stats}/>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl py-4 px-5 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                <h1 className="p-2 text-[#535353] dark:text-white text-2xl font-bold">Item List</h1>

                <div>
                    <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
                            <li className="me-2" role="presentation">
                                <button 
                                    onClick={() => handleTabClick('profile')} 
                                    className={getTabClasses('profile')} 
                                    type="button" 
                                    role="tab"
                                >
                                    Stocks
                                </button>
                            </li>
                            <li className="me-2" role="presentation">
                                <button 
                                    onClick={() => handleTabClick('dashboard')} 
                                    className={getTabClasses('dashboard')} 
                                    type="button" 
                                    role="tab"
                                >
                                    Stocks Transfer
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div id="default-tab-content">
                        {activeTab === 'profile' && (
                            <div id="profile" role="tabpanel">
                                <StocksTable 
                                    rowLimit={rowLimit}
                                    currentPage={currentPage}
                                    onTotalDataChange={handleDataChange}
                                    onAddProductClick={() => setIsAddProductModalOpen(true)}
                                    iconProps={iconProps}
                                    onAddProductClose={isAddProductModalOpen}
                                />
                            </div>
                        )}

                        {activeTab === 'dashboard' && (
                            <div id="dashboard" role="tabpanel">
                                <StocksTransferTable 
                                    rowLimit={rowLimit}
                                    currentPage={currentPage}
                                    onTotalDataChange={handleDataChange}
                                    // Trigger Transfer Modal
                                    onAddStockTransferClick={() => setIsAddTransferModalOpen(true)}
                                    iconProps={iconProps}
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

            {/* PRODUCT MODAL */}
            <AddProductModal 
                isOpen={isAddProductModalOpen} 
                onClose={() => setIsAddProductModalOpen(false)} 
            />

            {/* TRANSFER MODAL */}
            <AddStockTransferModal 
                isOpen={isAddTransferModalOpen} 
                onClose={() => setIsAddTransferModalOpen(false)} 
            />
        </div>
    );
}

export default StockManagement;
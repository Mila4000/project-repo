import React from 'react';
import { ArrowDownWideNarrow, Plus } from 'lucide-react';

import CustomDateRangeSelect from '../../components/filter/CustomDateRangeSelect'; 
import CustomSupplierSelect from '../../components/filter/CustomSupplierSelect'; 
import CustomDeliveryStatusSelect from '../../components/filter/CustomDeliveryStatusSelect'; 

function ReceivedItemsTableHeader({
    dateRangeOptions, supplierOptions, deliveryOptions,
    currentDateRange, currentSupplier, currentDeliveryStatus,
    handleDateRangeChange, handleSupplierChange, handleDeliveryChange,
    iconProps, onAddReceivedItemClick
}) {
    
    // NOTE: Handlers and options are now props, removed local definitions.
    
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-[#535353] dark:text-white text-2xl font-bold">Received Products</h1>
            
            <div className="flex items-center justify-end gap-12">
                <div className="flex items-center gap-3 py-2">
                    
                    {/* 1. Date Range Filter */}
                    <CustomDateRangeSelect
                        options={dateRangeOptions}
                        initialValue={currentDateRange}
                        onSelect={handleDateRangeChange}
                        iconProps={iconProps}
                    />
                    
                    {/* 2. Supplier Filter */}
                    <CustomSupplierSelect
                        options={supplierOptions}
                        initialValue={currentSupplier}
                        onSelect={handleSupplierChange}
                        iconProps={iconProps}
                    />

                    {/* 3. Delivery Status Filter */}
                    <CustomDeliveryStatusSelect
                        options={deliveryOptions}
                        initialValue={currentDeliveryStatus}
                        onSelect={handleDeliveryChange}
                        iconProps={iconProps}
                    />

                </div>
                
                <button className="cursor-pointer flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all" onClick={onAddReceivedItemClick}>
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Product</span>
                </button>
            </div>
        </div>
    );
}

export default ReceivedItemsTableHeader;
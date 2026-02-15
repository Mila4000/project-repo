import React from 'react';
import { Plus } from 'lucide-react';
import CustomSelect from '../../components/filter/CustomSupplierSelect'; 

function BrandListTableHeader({
    nameOptions,currentName, handleNameChange,
    iconProps, onBrandAdd
}) {
  return (
    <div className="flex items-center justify-between">
        <h1 className="text-[#454545] dark:text-white text-2xl font-bold">Brand List</h1>

        <div className="flex items-center justify-end gap-3">
            {/* 1. Name Filter */}
            <CustomSelect 
                options={nameOptions}
                initialValue={currentName}
                onSelect={handleNameChange}
                iconProps={iconProps}
            />
       

            <button className="cursor-pointer flex items-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all"
                onClick={onBrandAdd}
            >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Brand</span>
            </button>
        </div>
    </div>
  )
}

export default BrandListTableHeader;
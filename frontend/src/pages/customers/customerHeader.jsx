import React from 'react';
import { Plus } from 'lucide-react';

const CustomersHeader = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-2">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="text-sm text-gray-500">Manage your customer database</p>
      </div>
      <button
        onClick={onAddClick}
        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded"
      >
        <Plus size={18} />
        Add Customer
      </button>
    </div>
  );
};

export default CustomersHeader;
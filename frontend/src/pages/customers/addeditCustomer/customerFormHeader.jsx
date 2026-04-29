import React from 'react';
import { X } from 'lucide-react';

const CustomerFormHeader = ({ isEdit, onClose }) => (
  <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
    <div>
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        {isEdit ? "Edit Customer" : "Add Customer"}
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        {isEdit ? "Update customer information" : "Fill in the details below"}
      </p>
    </div>
    <button 
  onClick={onClose}
  className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
>
      <X size={18} />
    </button>
  </div>
);

export default CustomerFormHeader;
import React from 'react';
import { X } from 'lucide-react';

const CustomerFormHeader = ({ isEdit, onClose }) => (
  <div className="flex justify-between items-center p-5 border-b">
    <div>
      <h2 className="text-xl font-bold">
        {isEdit ? "Edit Customer" : "Add Customer"}
      </h2>
      <p className="text-xs text-gray-400">
        {isEdit ? "Update customer information" : "Fill in the details below"}
      </p>
    </div>
    <button onClick={onClose}>
      <X size={18} />
    </button>
  </div>
);

export default CustomerFormHeader;
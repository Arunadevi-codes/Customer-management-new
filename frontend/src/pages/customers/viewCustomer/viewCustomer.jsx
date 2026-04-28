import React from "react";
import { Users } from "lucide-react";
import CustomerTableHeader from "./customerTableHeader";
import CustomerRow from "./customerRow";

const ViewCustomers = ({ customers = [], onEdit, onDelete, onView, onSort, sortField, sortOrder }) => {
  const safeCustomers = customers || [];

  if (safeCustomers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500">
          <Users size={64} className="mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-700">No customers found</p>
          <p className="text-sm text-gray-400 mt-1">Click the "Add Customer" button to create your first customer</p>
        </div>
      </div>
    );
  }

  const getSortTooltip = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? "Click to sort by descending" : "Click to sort by ascending";
    }
    return "Click to sort by ascending";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <CustomerTableHeader 
            onSort={onSort} 
            sortField={sortField} 
            sortOrder={sortOrder} 
            getSortTooltip={getSortTooltip} 
          />
          <tbody className="bg-white divide-y divide-gray-200">
            {safeCustomers.map((customer) => (
              <CustomerRow 
                key={customer._id} 
                customer={customer} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onView={onView} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewCustomers;
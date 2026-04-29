import React from "react";
import { Users } from "lucide-react";
import CustomerTableHeader from "./customerTableHeader";
import CustomerRow from "./customerRow";

const ViewCustomers = ({ customers = [], onEdit, onDelete, onView, onSort, sortField, sortOrder }) => {
  const safeCustomers = customers || [];
 let sortedCustomers = [...safeCustomers];

if (sortField && (sortOrder === "asc" || sortOrder === "desc")) {
  sortedCustomers = sortedCustomers.sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    valA = valA ?? "";
    valB = valB ?? "";

    // 👉 convert date fields properly
    if (sortField === "createdAt") {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    // 👉 case-insensitive string sorting
    if (typeof valA === "string") {
      valA = valA.toLowerCase();
    }

    if (typeof valB === "string") {
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;

    return 0;
  });
}
  if (safeCustomers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <Users size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
          <p className="text-lg font-medium text-gray-700 dark:text-white">No customers found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Click the "Add Customer" button to create your first customer</p>
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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <CustomerTableHeader 
            onSort={onSort} 
            sortField={sortField} 
            sortOrder={sortOrder} 
            getSortTooltip={getSortTooltip} 
          />
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedCustomers.map((customer) => (
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
import React from 'react';
import { Search, X, } from "lucide-react";

const CustomersSearch = ({ 
  searchTerm, 
  onSearchChange,
  total = 0,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange
}) => {

  return (
    <div className="mb-3 space-y-3">

  {/* 🔥 ONE ROW CONTAINER */}
  <div className="flex items-center gap-3 flex-wrap">

    {/* 🔍 SEARCH BOX */}
    <div className="relative w-full max-w-sm">
      <Search 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full border pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {searchTerm && (
        <button
          type="button"
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <X size={16} className="text-gray-400 hover:text-red-500" />
        </button>
      )}
    </div>

    {/* 📅 DATE FILTER */}
    <div className="flex items-center gap-2">
      {/* 📅 Label */}
      <span className="text-sm text-gray-600 font-medium">
        Filter by Date:
      </span>
      <input
        type="date"
        value={fromDate || ""}
        onChange={(e) => onFromDateChange(e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <span className="text-gray-400 text-sm">to</span>

      <input
        type="date"
        min={fromDate}
        value={toDate || ""}
        onChange={(e) => onToDateChange(e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {/* ❌ Clear Dates */}
      {(fromDate || toDate) && (
        <button
          type="button"
          onClick={() => {
            onFromDateChange("");
            onToDateChange("");
          }}
          className="text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      )}
    </div>

  </div>

  {/* TOTAL */}
  <div className="px-2 py-2">
    <p className="text-xs text-gray-400">
      Total customers = {total}
    </p>
  </div>

</div>
  );
};

export default CustomersSearch;
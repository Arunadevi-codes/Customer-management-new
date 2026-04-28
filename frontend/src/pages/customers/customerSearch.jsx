import React from 'react';
import { Search, X } from "lucide-react";

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

      {/* 🔥 CONTAINER */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">

        {/* 🔍 SEARCH BOX */}
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border pl-10 pr-10 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={16} className="text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>

        {/* 📅 DATE FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">

          {/* Label */}
          <span className="text-xs sm:text-sm text-gray-600 font-medium">
            Filter by Date:
          </span>

          {/* Inputs */}
          <div className="flex items-center gap-2 flex-wrap w-full">
            <input
              type="date"
              value={fromDate || ""}
              onChange={(e) => onFromDateChange(e.target.value)}
              className="w-full sm:w-auto px-2 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <span className="text-gray-400 text-xs sm:text-sm">to</span>

            <input
              type="date"
              min={fromDate}
              value={toDate || ""}
              onChange={(e) => onToDateChange(e.target.value)}
              className="w-full sm:w-auto px-2 py-2 border rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            {/* ❌ Clear */}
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

      </div>

      {/* TOTAL */}
      <div className="px-1">
        <p className="text-xs text-gray-400">
          Total customers {total}
        </p>
      </div>

    </div>
  );
};

export default CustomersSearch;
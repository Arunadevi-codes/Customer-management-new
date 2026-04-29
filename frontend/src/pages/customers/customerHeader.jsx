import React, { useState, useEffect } from 'react';
import { Plus, Users, Search, Filter } from 'lucide-react';

const CustomersHeader = ({ onAddClick, onSearch, totalCount = 0 }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="space-y-2 sm:space-y-2 mb-2 sm:mb-3 md:mb-4">
      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        {/* Left Side - Title Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
            <Users size={isMobile ? 18 : 20} className="text-indigo-600" />
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Customers
            </h1>
            {totalCount > 0 && (
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
            Manage your customer database
          </p>
        </div>

        {/* Right Side - Add Button */}
        <button
          onClick={onAddClick}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus size={isMobile ? 14 : 16} className="sm:size-[18px] md:size-[20px]" />
          <span className="text-sm sm:text-base font-medium">
            {isMobile ? "Add" : "Add Customer"}
          </span>
        </button>
      </div>

      {/* Search Bar Row (Optional - for better UX) */}
      {onSearch && (
        <div className="w-full">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={isMobile ? "Search customers..." : "Search by name, email or phone..."}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-9 pr-10 py-2 sm:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => handleSearch({ target: { value: '' } })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Filter size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersHeader;
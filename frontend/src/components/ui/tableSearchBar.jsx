import React from 'react';
import { Search, X } from 'lucide-react';

const TableSearchBar = ({
  searchTerm,
  onSearchChange,
  total = 0,
  totalLabel = 'records',
  placeholder = 'Search...',
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  focusColor = 'indigo',
}) => {
  const ringClass =
    focusColor === 'orange'
      ? 'focus:ring-orange-400'
      : 'focus:ring-indigo-400';

  const inputBase =
    `w-full border border-gray-300 dark:border-gray-700 ` +
    `bg-white dark:bg-gray-900 text-gray-800 dark:text-white ` +
    `rounded-lg text-sm focus:outline-none focus:ring-2 ${ringClass}`;

  return (
    <div className="mb-3 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative w-full sm:max-w-xs md:max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />

          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={`${inputBase} pl-10 pr-10 py-2`}
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X
                size={16}
                className="text-gray-400 dark:text-gray-500 hover:text-red-500"
              />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-medium">
            Filter by Date:
          </span>

          <div className="flex items-center gap-2 flex-wrap w-full">
            <input
              type="date"
              value={fromDate || ''}
              onChange={(e) => onFromDateChange(e.target.value)}
              className={`${inputBase} w-full sm:w-auto px-2 py-2 text-xs sm:text-sm`}
            />

            <span className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
              to
            </span>

            <input
              type="date"
              min={fromDate}
              value={toDate || ''}
              onChange={(e) => onToDateChange(e.target.value)}
              className={`${inputBase} w-full sm:w-auto px-2 py-2 text-xs sm:text-sm`}
            />

            {(fromDate || toDate) && (
              <button
                type="button"
                onClick={() => {
                  onFromDateChange('');
                  onToDateChange('');
                }}
                className="text-red-500 hover:text-red-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-1">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Total {totalLabel}: {total}
        </p>
      </div>
    </div>
  );
};

export default TableSearchBar;
import React from 'react';

export const SortIcon = ({ field, sortField, sortOrder }) => {
  const isActive = sortField === field;

  return (
    <div className="inline-flex flex-col ml-1">
      <span
        className={`text-[10px] sm:text-xs leading-3 transition-colors duration-200 ${
          isActive && sortOrder === 'asc'
            ? 'text-blue-600 font-bold'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        ▲
      </span>

      <span
        className={`text-[10px] sm:text-xs leading-3 -mt-0.5 transition-colors duration-200 ${
          isActive && sortOrder === 'desc'
            ? 'text-blue-600 font-bold'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        ▼
      </span>
    </div>
  );
};

export const SortableTh = ({
  field,
  label,
  sortField,
  sortOrder,
  onSort,
  getSortTooltip,
}) => (
  <th
    onClick={() => onSort(field)}
    title={getSortTooltip ? getSortTooltip(field) : undefined}
    className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    <div className="flex items-center justify-center gap-4">
      <span>{label}</span>

      <SortIcon
        field={field}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </div>
  </th>
);

export const StaticTh = ({ label }) => (
  <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
    {label}
  </th>
);

export const TableHeaderRow = ({ children }) => (
  <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
    <tr className="border-b border-gray-200 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700">
      {children}
    </tr>
  </thead>
);
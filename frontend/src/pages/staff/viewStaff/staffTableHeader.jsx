import React from "react";

const SortIcon = ({ field, sortField, sortOrder }) => {

  const isActive = sortField === field;

  return (
    <div className="inline-flex flex-col ml-1">

      <span
        className={`text-[10px] sm:text-xs leading-3 transition-colors duration-200 ${
          isActive && sortOrder === "asc"
            ? "text-blue-600 font-bold"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        ▲
      </span>

      <span
        className={`text-[10px] sm:text-xs leading-3 -mt-0.5 transition-colors duration-200 ${
          isActive && sortOrder === "desc"
            ? "text-blue-600 font-bold"
            : "text-gray-400 dark:text-gray-500"
        }`}
      >
        ▼
      </span>

    </div>
  );
};

const StaffTableHeader = ({
  onSort,
  sortField,
  sortOrder,
  getSortTooltip
}) => {

  return (
    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">

      <tr className="border-b border-gray-200 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700">

        {/* NAME */}
        <th
          onClick={() => onSort("fullName")}
          className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          title={getSortTooltip("fullName")}
        >
          <div className="flex items-center justify-center gap-4">
            <span>Name</span>

            <SortIcon
              field="fullName"
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </div>
        </th>

        {/* PHONE */}
        <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
          Phone
        </th>

        {/* EMAIL */}
        <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
          Email
        </th>

        {/* STATUS */}
        <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
          Status
        </th>

        {/* CREATED */}
        <th
          onClick={() => onSort("createdAt")}
          className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          title={getSortTooltip("createdAt")}
        >
          <div className="flex items-center justify-center gap-4">

            <span>Created</span>

            <SortIcon
              field="createdAt"
              sortField={sortField}
              sortOrder={sortOrder}
            />

          </div>
        </th>

        {/* ACTIONS */}
        <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
          Actions
        </th>

      </tr>
    </thead>
  );
};

export default StaffTableHeader;
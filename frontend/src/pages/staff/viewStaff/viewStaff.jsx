import React from "react";
import { Users } from "lucide-react";
import StaffTableHeader from "./staffTableHeader";
import StaffRow from "./staffRow";

const StaffTable = ({
  staffs = [],
  onEdit,
  onDelete,
  onView,
  onSort,
  sortField,
  sortOrder
}) => {

  const safeStaffs = staffs || [];

  if (safeStaffs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">

        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">

          <Users
            size={64}
            className="mb-4 text-gray-300 dark:text-gray-600"
          />

          <p className="text-lg font-medium text-gray-700 dark:text-white">
            No staff found
          </p>

          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Click the "Add Staff" button to create your first staff
          </p>

        </div>
      </div>
    );
  }

  const getSortTooltip = (field) => {
    if (sortField === field) {
      return sortOrder === "asc"
        ? "Click to sort by descending"
        : "Click to sort by ascending";
    }

    return "Click to sort by ascending";
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">

          <StaffTableHeader
            onSort={onSort}
            sortField={sortField}
            sortOrder={sortOrder}
            getSortTooltip={getSortTooltip}
          />

          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">

            {safeStaffs.map((staff) => (
              <StaffRow
                key={staff._id}
                staff={staff}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}

          </tbody>
        </table>
      </div>
      {/* TOTAL COUNT */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Showing {safeStaffs.length} staff{safeStaffs.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default StaffTable;
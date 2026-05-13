import React, { useState } from "react";
import { Edit, Trash2, Eye } from "lucide-react";

const StaffRow = ({ staff, onEdit, onDelete, onView }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 280;
    const padding = 12;
    let left = rect.left;
    if (left + tooltipWidth > window.innerWidth) {
      left = window.innerWidth - tooltipWidth - padding;
    }
    setTooltip({ visible: true, x: left, y: rect.bottom + 8 });
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0 });
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 divide-x divide-gray-100 dark:divide-gray-700">

      {/* NAME */}
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border shadow-sm flex-shrink-0">
            {staff.profileImage ? (
              <img
                src={`http://localhost:5000/${staff.profileImage}`}
                alt={staff.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white w-full h-full flex items-center justify-center text-[10px] sm:text-xs font-medium">
                {staff.fullName?.charAt(0)?.toUpperCase() || "S"}
              </span>
            )}
          </div>
          <div
            className="truncate max-w-[120px] sm:max-w-[150px] text-xs sm:text-sm font-medium text-gray-800 dark:text-white"
            title={staff.fullName}
          >
            {staff.fullName}
          </div>
        </div>
      </td>

      {/* PHONE */}
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        <div className="truncate max-w-[120px]" title={staff.phone}>
          {staff.phone || "—"}
        </div>
      </td>

      {/* EMAIL */}
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        <div
          className="truncate max-w-[260px] cursor-default"
          onMouseEnter={staff.email ? handleMouseEnter : undefined}
          onMouseLeave={staff.email ? handleMouseLeave : undefined}
        >
          {staff.email || "—"}
        </div>

        {tooltip.visible && staff.email && (
          <div
            className="fixed z-[9999] bg-gray-700 dark:bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg max-w-[280px] break-words whitespace-normal pointer-events-none"
            style={{ top: tooltip.y, left: tooltip.x }}
          >
            {staff.email}
          </div>
        )}
      </td>

      {/* STATUS */}
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-center">
        <span
          className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
            staff.status === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {staff.status || "inactive"}
        </span>
      </td>

      {/* CREATED */}
      <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        <div className="truncate max-w-[120px]" title={staff.createdAt}>
          {staff.createdAt
            ? new Date(staff.createdAt).toLocaleDateString("en-IN")
            : "—"}
        </div>
      </td>

      {/* ACTIONS — conditionally rendered based on passed props */}
      <td className="px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex gap-1.5 sm:gap-2">
          {onView && (
            <button
              onClick={() => onView(staff)}
              className="p-1.5 sm:p-1 text-green-600 hover:bg-green-50 dark:hover:bg-gray-800 rounded-lg transition"
              title="View staff"
            >
              <Eye size={16} />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(staff)}
              className="p-1.5 sm:p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-lg transition"
              title="Edit staff"
            >
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(staff._id)}
              className="p-1.5 sm:p-1 text-red-600 hover:bg-red-50 dark:hover:bg-gray-800 rounded-lg transition"
              title="Delete staff"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </td>

    </tr>
  );
};

export default StaffRow;
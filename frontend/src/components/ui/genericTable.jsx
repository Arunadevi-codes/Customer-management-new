import React from "react";
import { Users } from "lucide-react";
import {
  TableHeaderRow,
  SortableTh,
  StaticTh,
} from "./tableSortHeader";

const GenericTable = ({
  rows = [],
  columns = [],
  renderRow,
  onSort,
  sortField,
  sortOrder,
  sortFn,
  emptyIcon: EmptyIcon = Users,
  emptyTitle = "No records found",
  emptySubtitle = "",
  footerLabel = "record",
}) => {
  const safeRows = rows || [];

  let sortedRows = [...safeRows];

  if (sortField && (sortOrder === "asc" || sortOrder === "desc")) {
    sortedRows = sortedRows.sort((a, b) => {
      if (sortFn) return sortFn(a, b, sortField, sortOrder);

      let valA = a[sortField] ?? "";
      let valB = b[sortField] ?? "";

      if (sortField === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;

      return 0;
    });
  }

  const getSortTooltip = (field) => {
    if (sortField === field) {
      return sortOrder === "asc"
        ? "Click to sort descending"
        : "Click to sort ascending";
    }

    return "Click to sort ascending";
  };

  if (safeRows.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-10 text-center border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <EmptyIcon
            size={60}
            className="mb-4 text-gray-300 dark:text-gray-600"
          />

          <p className="text-lg font-semibold text-gray-700 dark:text-white">
            {emptyTitle}
          </p>

          {emptySubtitle && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {emptySubtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <div
        className="overflow-x-auto lg:overflow-x-visible"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table className="min-w-[900px] lg:min-w-0 w-full table-auto border-collapse">
          <TableHeaderRow>
            {columns.map((col) =>
              col.sortable ? (
                <SortableTh
                  key={col.field}
                  field={col.field}
                  label={col.label}
                  onSort={onSort}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  getSortTooltip={getSortTooltip}
                />
              ) : (
                <StaticTh key={col.label} label={col.label} />
              )
            )}
          </TableHeaderRow>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedRows.map((row) => renderRow(row))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Showing {sortedRows.length} {footerLabel}
          {sortedRows.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

export default GenericTable;
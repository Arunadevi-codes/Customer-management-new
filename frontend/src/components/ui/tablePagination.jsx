import React from 'react';

const TablePagination = ({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  const btnBase =
    "px-3 py-1 border border-gray-300 dark:border-gray-700 rounded text-sm transition";

  const btnEnabled =
    "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800";

  const btnDisabled =
    "opacity-50 cursor-not-allowed bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200";

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-2 border-t border-gray-200 dark:border-gray-700 pt-3">
      <select
        value={limit}
        onChange={(e) => {
          onLimitChange(Number(e.target.value));
          onPageChange(1);
        }}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-2 py-1 rounded text-sm outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
        <option value={50}>50 / page</option>
      </select>

      <div className="flex flex-wrap justify-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={`${btnBase} ${
            page === 1 ? btnDisabled : btnEnabled
          }`}
        >
          Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`${btnBase} ${
              page === num
                ? 'bg-blue-500 text-white border-blue-500'
                : btnEnabled
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() =>
            onPageChange(Math.min(page + 1, totalPages))
          }
          disabled={page === totalPages}
          className={`${btnBase} ${
            page === totalPages ? btnDisabled : btnEnabled
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
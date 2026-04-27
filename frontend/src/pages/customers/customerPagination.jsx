import React from "react";

const CustomersPagination = ({
  page,
  totalPages,
  limit,
  totalRecords,
  onPageChange,
  onLimitChange,
}) => {
  // Generate page numbers dynamically
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-between items-center mt-2 border-t pt-3">
      {/* Limit Dropdown */}
      <select
        value={limit}
        onChange={(e) => {
          onLimitChange(Number(e.target.value));
          onPageChange(1); // reset to first page
        }}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
        <option value={50}>50 / page</option>
      </select>

      {/* Page Numbers */}
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={`px-3 py-1 border rounded ${
            page === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Prev
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`px-3 py-1 border rounded ${
              page === num ? "bg-blue-500 text-white" : ""
            }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-3 py-1 border rounded ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomersPagination;

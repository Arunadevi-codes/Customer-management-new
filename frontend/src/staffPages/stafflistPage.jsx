// import React, { useState } from "react";

import TableSearchBar  from "../components/ui/tableSearchBar";
import LoadingSpinner  from "../components/ui/loadingSpinner";
import TablePagination from "../components/ui/tablePagination";
// import PageHeader      from "../components/ui/pageHeader";

import StaffTable  from "../pages/staff/viewStaff/viewStaff";
import StaffPOPup  from "../pages/staff/staffPOPup";
import StaffForm   from "../pages/staff/addeditStaff/staffForm";

import { useStaff } from "../pages/staff/useStaff";
import { Users } from "lucide-react";

const StaffListPage = () => {

  const {
    staffs,
    loading,

    searchTerm,
    handleSearch,

    viewStaff,
    setViewStaff,

    isModalOpen,
    setIsModalOpen,
    editingStaff,

    total,

    handleEditClick,
    handleSaveStaff,

    sortField,
    sortOrder,
    handleSort,
    handleViewClick,

    fromDate,
    toDate,
    setFromDate,
    setToDate,

    // pagination
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
  } = useStaff();

  return (
    <div className="p-3 md:p-4 space-y-3 min-h-screen">

      {/* HEADER — no add button */}
      <div className="space-y-2 mb-2 sm:mb-3 md:mb-4">
        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
          <Users size={20} className="text-indigo-600" />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Staff Directory
          </h1>
          {total > 0 && (
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {total}
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
          View and manage staff members
        </p>
      </div>

      {/* SEARCH + DATE FILTER */}
      <TableSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        total={total}
        totalLabel="staff"
        placeholder="Search staff..."
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        focusColor="indigo"
      />

      {/* TABLE / LOADING */}
      {loading ? (
        <LoadingSpinner label="Loading staff..." />
      ) : (
        <>
          <StaffTable
            staffs={staffs}
            onEdit={handleEditClick}  
            onView={handleViewClick}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
          />

          {/* PAGINATION */}
          <TablePagination
            page={page}
            totalPages={totalPages}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />
        </>
      )}

      {/* EDIT FORM MODAL */}
      {isModalOpen && (
        <StaffForm
          staff={editingStaff}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
        />
      )}

      {/* VIEW POPUP */}
      {viewStaff && (
        <StaffPOPup
          staff={viewStaff}
          onClose={() => setViewStaff(null)}
        />
      )}

    </div>
  );
};

export default StaffListPage;
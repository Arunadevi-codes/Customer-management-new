import React from "react";

import PageHeader     from "../../components/ui/pageHeader";
import TableSearchBar from "../../components/ui/tableSearchBar";
import LoadingSpinner from "../../components/ui/loadingSpinner";
import TablePagination from "../../components/ui/tablePagination";

import DeleteStaff from "./deleteStaff";
import StaffPOPup  from "./staffPOPup";
import StaffTable  from "./viewStaff/viewStaff";
import StaffForm   from "./addeditStaff/staffForm";

import { useStaff } from "./useStaff";

const Staff = () => {

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

    isDeleteModalOpen,
    setIsDeleteModalOpen,

    total,

    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSaveStaff,
    handleConfirmDelete,

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

      {/* HEADER */}
      <PageHeader
        title="Staff"
        subtitle="Manage your staff database"
        addLabel="Add Staff"
        addLabelMob="Add"
        totalCount={total}
        onAddClick={handleAddClick}
      />

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
        focusColor="orange"
      />

      {/* TABLE / LOADING */}
      {loading ? (
        <LoadingSpinner label="Loading staff..." />
      ) : (
        <>
          <StaffTable
            staffs={staffs}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
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

      {/* ADD / EDIT FORM MODAL */}
      {isModalOpen && (
        <StaffForm
          staff={editingStaff}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {isDeleteModalOpen && (
        <DeleteStaff
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
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

export default Staff;
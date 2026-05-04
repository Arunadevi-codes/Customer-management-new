import React from "react";

import StaffHeader from "./staffHeader";
import StaffSearch from "./staffSearch";
import StaffLoading from "./staffLoading";
import DeleteStaff from "./deleteStaff";
import StaffPOPup from "./staffPOPup";
import StaffTable from "./viewStaff/viewStaff";
import StaffForm from "./addeditStaff/staffForm";

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
} = useStaff();

  return (
    <div className="p-3 md:p-4 space-y-3 min-h-screen">

      {/* HEADER */}
      <StaffHeader
        onAddClick={handleAddClick}
        totalCount={total}
      />

      {/* SEARCH */}
      <StaffSearch
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        total={total}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {/* TABLE / LOADING */}
      {loading ? (
        <StaffLoading />
      ) : (
        <StaffTable
          staffs={staffs}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onView={handleViewClick} 
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      )}

      {/* FORM MODAL (STEP FORM) */}
      {isModalOpen && (
        <StaffForm
          staff={editingStaff}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
        />
      )}

      {isDeleteModalOpen && (
  <DeleteStaff
    onConfirm={handleConfirmDelete}
    onClose={() => setIsDeleteModalOpen(false)}
  />
)}

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
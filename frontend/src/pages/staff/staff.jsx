import React from "react";

import PageHeader      from "../../components/ui/pageHeader";
import TableSearchBar  from "../../components/ui/tableSearchBar";
import LoadingSpinner  from "../../components/ui/loadingSpinner";
import TablePagination from "../../components/ui/tablePagination";

import DeleteStaff from "./deleteStaff";
import StaffPOPup  from "./staffPOPup";
import StaffTable  from "./viewStaff";
import StaffForm   from "./addeditStaff/staffForm";

import { useStaff } from "./useStaff";
import { useAuth }  from "../../contexts/authContext"; // ← import your auth context

const Staff = () => {

  const { user } = useAuth();                        // ← get the logged-in user
  const isSuperAdmin = user?.role === "superadmin";  // ← true for admin, false for staff

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

      {/* HEADER
          - superadmin : shows title + "Add Staff" button (original behaviour)
          - staff      : shows title only, no add button                        */}
      {isSuperAdmin ? (
        <PageHeader
          title="Staff"
          subtitle="Manage your staff database"
          addLabel="Add Staff"
          addLabelMob="Add"
          totalCount={total}
          onAddClick={handleAddClick}
          focusColor="orange"
        />
      ) : (
        <PageHeader
          title="Staff Directory"
          subtitle="View and manage staff members"
          totalCount={total}
          /* no onAddClick → PageHeader should hide the button when it is absent */
          focusColor="indigo"
        />
      )}

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
        focusColor={isSuperAdmin ? "orange" : "indigo"}
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
            /* only pass onDelete when the user is superadmin;
               StaffTable should hide the delete column/button when it is undefined */
            onDelete={isSuperAdmin ? handleDeleteClick : undefined}
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

      {/* ADD / EDIT FORM MODAL — edit is allowed for both roles */}
      {isModalOpen && (
        <StaffForm
          staff={editingStaff}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
        />
      )}

      {/* DELETE CONFIRM MODAL — superadmin only */}
      {isSuperAdmin && isDeleteModalOpen && (
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
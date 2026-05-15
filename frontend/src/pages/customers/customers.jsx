import React, { useState, useEffect } from 'react';

import PageHeader from '../../components/ui/pageHeader';
import TableSearchBar from '../../components/ui/tableSearchBar';
import LoadingSpinner from '../../components/ui/loadingSpinner';
import TablePagination from '../../components/ui/tablePagination';

import { useAuth } from '../../contexts/authContext';
import { useCustomers } from './useCustomers';
import ViewCustomer from './viewCustomer';
import ViewCustomers from './customerPOPup';
import CustomerForm from './addeditCustomer/customerForm';
import DeleteCustomer from './deleteCustomer';
import statesData from '../../data/statesData';

const Customers = () => {
  const { user }  = useAuth();
  const isAdmin   = user?.role === "superadmin";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    customers,
    states,
    cities,
    pincode,
    loading,
    searchTerm,
    setSearchTerm,
    isModalOpen,
    setIsModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    editingCustomer,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSaveCustomer,
    handleConfirmDelete,
    handleView,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    selectedCustomer,
    showView,
    setShowView,
    handleSort,
    sortField,
    sortOrder,
  } = useCustomers();

  return (
    <div className="w-full min-h-screen p-3 md:p-4 space-y-4">

      {/* HEADER — Add button hidden for staff */}
      <PageHeader
        title="Customers"
        subtitle={isAdmin ? "Manage your customer database" : "Your assigned customers"}
        addLabel={isAdmin ? "Add Customer" : undefined}
        addLabelMob={isAdmin ? "Add" : undefined}
        totalCount={total}
        onAddClick={isAdmin ? handleAddClick : undefined}
      />

      {/* SEARCH */}
      <TableSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        total={total}
        totalLabel="customers"
        placeholder={isMobile ? 'Search...' : 'Search by name, email or phone...'}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {/* TABLE */}
      {loading ? (
        <LoadingSpinner label="Loading customers..." />
      ) : (
        <>
          <div className="w-full max-w-full min-w-0">
            <ViewCustomer
              customers={customers}
              states={states}
              cities={cities}
              pincode={pincode}
              // Staff can view but not edit or delete
              onEdit={isAdmin ? handleEditClick : undefined}
              onDelete={isAdmin ? handleDeleteClick : undefined}
              total={total}
              onView={handleView}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </div>

          {/* PAGINATION */}
          {total > 0 && (
            <TablePagination
              page={page}
              totalPages={totalPages}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(newLimit) => {
                setLimit(newLimit);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      {/* ADD / EDIT — admin only */}
      {isAdmin && isModalOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* DELETE — admin only */}
      {isAdmin && isDeleteModalOpen && (
        <DeleteCustomer
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}

      {/* VIEW — available to all */}
      {showView && (
        <ViewCustomers
          customer={selectedCustomer}
          onClose={() => setShowView(false)}
          states={Object.values(statesData)}
        />
      )}
    </div>
  );
};

export default Customers;
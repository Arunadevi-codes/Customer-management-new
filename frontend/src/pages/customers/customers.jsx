// src/pages/customers/customers.jsx

import React from 'react';

import PageHeader     from '../../components/ui/pageHeader';
import TableSearchBar from '../../components/ui/tableSearchBar';
import LoadingSpinner from '../../components/ui/loadingSpinner';
import TablePagination from '../../components/ui/tablePagination';

import { useCustomers }  from './useCustomers';
import ViewCustomer      from './viewCustomer/viewCustomer';
import ViewCustomers     from './customerPOPup';
import CustomerForm      from './addeditCustomer/customerForm';
import DeleteCustomer    from './deleteCustomer';
import statesData        from '../../data/statesData';

const Customers = () => {

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
    <div className="p-3 md:p-4 space-y-2 min-h-screen">

      {/* HEADER */}
      <PageHeader
        title="Customers"
        subtitle="Manage your customer database"
        addLabel="Add Customer"
        addLabelMob="Add"
        totalCount={total}
        onAddClick={handleAddClick}
      />

      {/* SEARCH + DATE FILTER */}
      <TableSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        total={total}
        totalLabel="customers"
        placeholder="Search by name, email or phone..."
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      {/* TABLE / LOADING */}
      {loading ? (
        <LoadingSpinner label="Loading customers..." />
      ) : (
        <>
          <ViewCustomer
            customers={customers}
            states={states}
            cities={cities}
            pincode={pincode}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            total={total}
            onView={handleView}
            onSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
          />

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

      {/* ADD / EDIT FORM MODAL */}
      {isModalOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {isDeleteModalOpen && (
        <DeleteCustomer
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}

      {/* VIEW POPUP */}
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
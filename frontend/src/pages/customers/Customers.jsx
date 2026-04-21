import React from 'react';
import { useCustomers } from './useCustomers';
import CustomersHeader from './customerHeader';
import CustomersSearch from './customerSearch';
import CustomersLoading from './customerLoading';
import CustomersPagination from './customerPagination';
import ViewCustomers from './viewCustomer';
import AddEditCustomers from './addeditCustomer';
import DeleteCustomer from './deleteCustomer';

const Customers = () => {
  const {
    customers,
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
    fromDate,
    setFromDate,
    toDate,
    setToDate,
  } = useCustomers();

  return (
    <div className="p-3 md:p-4 space-y-2">
  <CustomersHeader onAddClick={handleAddClick} />
  <CustomersSearch 
    searchTerm={searchTerm} 
    onSearchChange={setSearchTerm} 
    total={total} 
    customers={customers} 
    loading={loading} 
    fromDate={fromDate}
    toDate={toDate}
    onFromDateChange={setFromDate}
    onToDateChange={setToDate}
  />
  {loading ? (
    <CustomersLoading />
  ) : (
    <>
      <ViewCustomers
        customers={customers}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        total={total}
      />
      {total > 0 && (
        <CustomersPagination
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
  {isModalOpen && (
    <AddEditCustomers
      customer={editingCustomer}
      onSave={handleSaveCustomer}
      onClose={() => setIsModalOpen(false)}
    />
  )}
  {isDeleteModalOpen && (
    <DeleteCustomer
      onConfirm={handleConfirmDelete}
      onClose={() => setIsDeleteModalOpen(false)}
    />
  )}
</div>

  );
};

export default Customers;
import React from 'react';
import { useCustomers } from './useCustomers';
import CustomersHeader from './customerHeader';
import CustomersSearch from './customerSearch';
import CustomersLoading from './customerLoading';
import CustomersPagination from './customerPagination';
import ViewCustomers from './ViewCustomer';
import AddEditCustomers from './AddEditCustomer';
import DeleteCustomer from './DeleteCustomer';

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
  } = useCustomers();

  return (
    <div className="p-4 md:p-6">
      <CustomersHeader onAddClick={handleAddClick} />
      <CustomersSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {loading ? (
        <CustomersLoading />
      ) : (
        <>
          <ViewCustomers
            customers={customers}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
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
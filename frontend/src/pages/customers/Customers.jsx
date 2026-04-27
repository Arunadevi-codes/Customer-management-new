import React from 'react';
import { useCustomers } from './useCustomers';
import CustomersHeader from './customerHeader';
import CustomersSearch from './customerSearch';
import CustomersLoading from './customerLoading';
import CustomersPagination from './customerPagination';
import ViewCustomer from './viewCustomer';
import ViewCustomers from './customerPOPup';
import AddCustomer from './addCustomer';
import EditCustomer from './editCustomer';
import DeleteCustomer from './deleteCustomer';
import statesData from '../../data/statesData';

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
    setShowView
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
    
      <ViewCustomer
        customers={customers}
        states={states}
        cities={cities}
        pincode={pincode}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        total={total}
        onView={handleView}
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
  editingCustomer ? (
    <EditCustomer
      customer={editingCustomer}
      onSave={handleSaveCustomer}
      onClose={() => setIsModalOpen(false)}
    />
  ) : (
    <AddCustomer
      onSave={handleSaveCustomer}
      onClose={() => setIsModalOpen(false)}
    />
  )
)}
  {isDeleteModalOpen && (
    <DeleteCustomer
      onConfirm={handleConfirmDelete}
      onClose={() => setIsDeleteModalOpen(false)}
    />
  )}

  {showView && (
  <ViewCustomers
    customer={selectedCustomer}
    onClose={() => setShowView(false)}
    states={Object.values(statesData)}
    // cities={[]}
  />
)}
</div>

  );
};

export default Customers;
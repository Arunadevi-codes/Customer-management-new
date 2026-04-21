import React from 'react';

const CustomersLoading = () => {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      <p className="mt-2 text-gray-500">Loading customers...</p>
    </div>
  );
};

export default CustomersLoading;
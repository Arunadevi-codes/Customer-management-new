import React from 'react';

const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="text-center py-8 bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
    <p className="mt-2 text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

export default LoadingSpinner;
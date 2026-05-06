import React from 'react';

export const inputBase =
  "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm " +
  "bg-gray-50 dark:bg-gray-800/60 " +
  "border border-gray-200 dark:border-gray-700 " +
  "text-gray-900 dark:text-gray-100 " +
  "placeholder-gray-400 dark:placeholder-gray-600 " +
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 " +
  "focus:border-transparent focus:bg-white dark:focus:bg-gray-800 " +
  "transition-all duration-200";

export const inputBasePlain =
  "w-full px-4 py-2.5 rounded-xl text-sm " +
  "bg-white dark:bg-gray-800 " +
  "border border-gray-200 dark:border-gray-700 " +
  "text-gray-800 dark:text-white " +
  "placeholder-gray-400 dark:placeholder-gray-600 " +
  "focus:border-indigo-400 focus:ring-2 " +
  "focus:ring-indigo-100 dark:focus:ring-indigo-900 " +
  "outline-none transition-all";

const FormField = ({
  label,
  icon: Icon,
  iconSize = 18,
  required = false,
  error,
  children,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
      {Icon && <Icon size={iconSize} className="text-indigo-600" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>

    {children}

    {error && (
      <p className="text-xs text-red-500">{error}</p>
    )}
  </div>
);

export default FormField;
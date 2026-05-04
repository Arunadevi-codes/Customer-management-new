import React from 'react';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

export const inputBase =
  "w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200";

export const Field = ({ label, required, icon: Icon, toggle, onToggle, showValue, children, validation }) => (
  <div>
    <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
      {label}
      {required && <span className="text-indigo-500 text-sm">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 dark:text-indigo-500 pointer-events-none" />
      )}
      {children}
      {toggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          {showValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
    {validation && (
      <p className={`mt-1.5 text-xs flex items-center gap-1.5 font-medium ${
        validation.valid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
      }`}>
        {validation.valid ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
        {validation.message}
      </p>
    )}
  </div>
);

export const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 whitespace-nowrap">
      {label}
    </span>
    <div className="flex-1 h-px bg-indigo-100 dark:bg-indigo-900/50" />
  </div>
);
import React from 'react';

export const inputBase =
  "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200";

export const Field = ({ label, required, icon: Icon, children, hint }) => (
  <div className="group">
    <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
      {label}
      {required && <span className="text-indigo-500 text-sm">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 dark:text-indigo-500 pointer-events-none" />
      )}
      {children}
    </div>
    {hint && <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{hint}</p>}
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
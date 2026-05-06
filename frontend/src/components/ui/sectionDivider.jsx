import React from 'react';

const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3">
    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 whitespace-nowrap">
      {label}
    </span>

    <div className="flex-1 h-px bg-indigo-100 dark:bg-indigo-900/50" />
  </div>
);

export default SectionDivider;
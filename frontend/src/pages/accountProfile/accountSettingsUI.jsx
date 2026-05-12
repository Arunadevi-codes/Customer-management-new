import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const SectionTitle = ({ title }) => (
  <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8 first:border-0 first:pt-0 first:mt-0">
    <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5">
      {title}
    </h2>
  </div>
);

export const Field = ({ label, children, className = "" }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
      {label}
    </label>
    {children}
  </div>
);

export const inputStyles = (disabled) =>
  `w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all duration-200
  ${
    disabled
      ? "bg-gray-100 dark:bg-[#1d1d1d] border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
      : "bg-white dark:bg-[#181818] border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-orange-400 dark:focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20"
  }`;

export const TextInput = ({ disabled, ...props }) => (
  <input disabled={disabled} className={inputStyles(disabled)} {...props} />
);

export const SelectInput = ({ disabled, children, ...props }) => (
  <select disabled={disabled} className={inputStyles(disabled)} {...props}>
    {children}
  </select>
);

export const PwdInput = ({ id, label, value, onChange, disabled, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <Field label={label}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`${inputStyles(disabled)} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </Field>
  );
};
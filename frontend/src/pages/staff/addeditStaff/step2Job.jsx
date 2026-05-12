import React from 'react';
import { IdCard, Calendar, Activity, UserCog, Loader2 } from 'lucide-react';

const inputBase =
  "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200";

const Field = ({ label, required, icon: Icon, children, hint }) => (
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
    </div>
    {hint && <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">{hint}</p>}
  </div>
);

// Inline error message component
const InlineError = ({ message }) =>
  message ? (
    <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
      {/* <XCircle className="w-3 h-3 shrink-0" /> */}
      {message}
    </p>
  ) : null;

const Step2Job = ({ form, handleChange, errors = {} }) => {
  return (
    <div className="w-full max-w-lg mx-auto px-1 py-4 space-y-6">

      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Job Information
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Role, ID and employment details
        </p>
      </div>

      {/* Role */}
      <div>
        <Field label="Role" required icon={UserCog}>
          <select
            name="role"
            value={form.role || ''}
            onChange={handleChange}
            className={`${inputBase} appearance-none ${errors.role ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
          >
            <option value="">Select role</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <InlineError message={errors.role} />
      </div>

      {/* Employee ID — auto-generated badge style */}
      <div>
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
          Employee ID
        </label>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
          <IdCard className="w-4 h-4 text-indigo-500 flex-shrink-0" />
          {form.employeeId ? (
            <>
              <span className="text-sm font-bold tracking-widest text-indigo-700 dark:text-indigo-300">
                {form.employeeId}
              </span>
              <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300">
                Auto
              </span>
            </>
          ) : (
            <>
              <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
              <span className="text-sm text-indigo-400 dark:text-indigo-500 italic">Generating ID...</span>
            </>
          )}
        </div>
        <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
          Auto-assigned by the system — cannot be edited
        </p>
      </div>

      {/* Joining Date + Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Field label="Joining Date" required icon={Calendar}>
            <input
              type="date"
              name="dateOfJoining"
              value={form.dateOfJoining || ''}
              onChange={handleChange}
              className={`${inputBase} [&::-webkit-calendar-picker-indicator]:dark:invert ${errors.dateOfJoining ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
            />
          </Field>
          <InlineError message={errors.dateOfJoining} />
        </div>

        <div>
          <Field label="Status" required icon={Activity}>
            <select
              name="status"
              value={form.status || ''}
              onChange={handleChange}
              className={`${inputBase} appearance-none ${errors.status ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Field>
          <InlineError message={errors.status} />
        </div>
      </div>

      {/* Status indicator pill */}
      {form.status && (
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${form.status === 'active' ? 'bg-green-500' : 'bg-red-400'}`} />
          <span className={`text-xs font-semibold ${form.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
            Employee will be marked as {form.status}
          </span>
        </div>
      )}
    </div>
  );
};

export default Step2Job;
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, ShieldCheck, Info } from 'lucide-react';

const inputBase =
  "w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200";

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

const PasswordToggle = ({ show, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
  >
    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
);

// Inline error message component
const InlineError = ({ message }) =>
  message ? (
    <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1 font-medium">
      {message}
    </p>
  ) : null;

const Step3Login = ({ form, handleChange, isEdit, errors = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch =
    form.password && form.confirmPassword && form.password === form.confirmPassword;

  const passwordStrength = (p = '') => {
    if (!p) return null;
    if (p.length < 6) return { label: 'Too short', color: 'bg-red-400', width: '20%' };
    if (p.length < 8) return { label: 'Weak', color: 'bg-orange-400', width: '40%' };
    if (/[A-Z]/.test(p) && /\d/.test(p) && p.length >= 8)
      return { label: 'Strong', color: 'bg-green-500', width: '100%' };
    return { label: 'Moderate', color: 'bg-yellow-400', width: '65%' };
  };

  const strength = passwordStrength(form.password);

  return (
    <div className="w-full max-w-lg mx-auto px-1 py-4 space-y-6">

      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Login Credentials
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isEdit ? 'Update account access for this staff member' : 'Set up account access for this staff member'}
        </p>
      </div>

      {/* Notice */}
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
        isEdit
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800'
          : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800'
      }`}>
        {isEdit ? (
          <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
        )}
        <p className={`text-xs ${
          isEdit
            ? 'text-amber-700 dark:text-amber-300'
            : 'text-indigo-700 dark:text-indigo-300'
        }`}>
          {isEdit
            ? 'Leave password fields blank to keep the current password unchanged.'
            : 'Credentials are securely hashed and stored. The staff member will use these to log in.'}
        </p>
      </div>

      {/* Email */}
      <div>
        <Field
          label="Login Email"
          required
          icon={Mail}
          hint="This email will be used to log into the account"
        >
          <input
            type="email"
            name="loginEmail"
            placeholder="staff@company.com"
            value={form.loginEmail || ''}
            onChange={handleChange}
            className={`${inputBase} ${errors.loginEmail ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
          />
        </Field>
        <InlineError message={errors.loginEmail} />
      </div>

      {/* Password */}
      <div>
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
          {isEdit ? 'New Password' : 'Password'}
          {!isEdit && <span className="text-indigo-500 text-sm">*</span>}
          {isEdit && <span className="text-gray-400 text-[10px] normal-case tracking-normal font-normal ml-1">(optional)</span>}
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 dark:text-indigo-500 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder={isEdit ? 'Enter new password to change' : 'Create a strong password'}
            value={form.password || ''}
            onChange={handleChange}
            className={`${inputBase} ${errors.password ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
          />
          <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
        </div>

        {/* Strength bar */}
        {strength && (
          <div className="mt-2 space-y-1">
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <p className={`text-[11px] font-medium ${
              strength.label === 'Strong' ? 'text-green-500' :
              strength.label === 'Moderate' ? 'text-yellow-500' : 'text-red-400'
            }`}>
              {strength.label} password
            </p>
          </div>
        )}
        <InlineError message={errors.password} />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
          Confirm Password
          {!isEdit && <span className="text-indigo-500 text-sm">*</span>}
          {isEdit && <span className="text-gray-400 text-[10px] normal-case tracking-normal font-normal ml-1">(optional)</span>}
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 dark:text-indigo-500 pointer-events-none" />
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Re-enter your password"
            value={form.confirmPassword || ''}
            onChange={handleChange}
            className={`${inputBase} ${
              errors.confirmPassword
                ? 'border-red-400 dark:border-red-600 focus:ring-red-500'
                : form.confirmPassword
                  ? passwordsMatch
                    ? 'border-green-400 dark:border-green-600 focus:ring-green-500'
                    : 'border-red-400 dark:border-red-600 focus:ring-red-500'
                  : ''
            }`}
          />
          <PasswordToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
        </div>

        {/* Live match indicator (only when user has typed something) */}
        {form.confirmPassword && (
          <p className={`mt-1.5 text-xs flex items-center gap-1.5 font-medium ${
            passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
          }`}>
            {passwordsMatch && (
              <CheckCircle className="w-3.5 h-3.5" />
            )}
            {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
          </p>
        )}

        {/* Inline error — shown only when field is empty and form was submitted */}
        {!form.confirmPassword && <InlineError message={errors.confirmPassword} />}
      </div>

    </div>
  );
};

export default Step3Login;
import React, { useState, useRef } from 'react';
import { Eye, EyeOff, CheckCircle, Upload, FileText, X } from 'lucide-react';

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
        {validation.valid && <CheckCircle className="w-3.5 h-3.5" />}
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

export const docInputBase =
  'w-full h-10 px-3 rounded-lg text-sm font-mono ' +
  'bg-gray-50 dark:bg-gray-800/60 ' +
  'border border-gray-200 dark:border-gray-700 ' +
  'text-gray-900 dark:text-gray-100 ' +
  'placeholder:text-gray-400 dark:placeholder:text-gray-600 placeholder:font-sans ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 dark:focus:border-indigo-500 ' +
  'transition-all duration-150';

export const DocField = ({ label, required, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 select-none">
      {Icon && <Icon className="w-3.5 h-3.5 text-indigo-400 dark:text-indigo-500 shrink-0" />}
      {label}
      {required && <span className="text-indigo-500 text-sm leading-none">*</span>}
    </label>
    {children}
  </div>
);

export const DocValidationHint = ({ valid, message }) => (
  <p className={`text-xs font-medium ${valid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
    {valid && <CheckCircle className="w-3.5 h-3.5 shrink-0 inline mr-1" />}
    {message}
  </p>
);

export const EyeToggle = ({ show, onToggle }) => (
  <button
    type="button" onClick={onToggle} title={show ? 'Hide' : 'Show'}
    className="shrink-0 w-9 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors duration-150"
  >
    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
  </button>
);

// ── Document image upload — supports new upload + existing image display ──
// existingUrl: full URL of already-saved image (passed when editing)
export const DocImageUpload = ({ label, name, value, existingUrl, onChange }) => {
  const inputRef = useRef(null);
  const [preview, setPreview]         = useState(null);   // object URL for newly picked file
  const [showPreview, setShowPreview] = useState(false);
  const [removed, setRemoved]         = useState(false);  // user explicitly removed existing

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return;
    setPreview(file.type.startsWith('image/') ? URL.createObjectURL(file) : null);
    setRemoved(false);
    onChange({ target: { name, files: [file] } });
  };

  const handleRemove = () => {
    setPreview(null);
    setRemoved(true);
    if (inputRef.current) inputRef.current.value = '';
    onChange({ target: { name, value: null } });
  };

  // Decide what to show
  const isNewFile      = value instanceof File;
  const hasExisting    = !removed && existingUrl && !isNewFile;
  const hasNewPreview  = isNewFile && preview;
  const hasAny         = isNewFile || hasExisting;

  // The URL to use for preview modal
  const previewSrc = hasNewPreview ? preview : hasExisting ? existingUrl : null;

  return (
    <>
      {!hasAny ? (
        // ── Upload zone ──
        <button type="button" onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 w-full h-9 px-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-transparent text-[13px] text-gray-400 dark:text-gray-500 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150">
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span>Upload {label}</span>
          <span className="ml-auto text-[11px] text-gray-300 dark:text-gray-600 hidden sm:inline">image or PDF</span>
        </button>
      ) : (
        // ── File chip — shows for both new file and existing image ──
        <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-green-200 dark:border-green-700/60 bg-green-50 dark:bg-green-900/20">
          <FileText className="w-3.5 h-3.5 text-green-600 dark:text-green-400 shrink-0" />
          <span className="flex-1 min-w-0 text-[12px] text-green-700 dark:text-green-300 truncate">
            {isNewFile ? value.name : `${label} on record`}
          </span>
          <div className="flex items-center gap-0.5 shrink-0">
            {/* ✅ Preview button — works for both new and existing */}
            {previewSrc && (
              <button type="button" onClick={() => setShowPreview(true)} title="Preview"
                className="w-6 h-6 flex items-center justify-center rounded text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800/50 transition-colors">
                <Eye className="w-3.5 h-3.5" />
              </button>
            )}
            {/* ✅ Replace button — allows uploading a new file over existing */}
            <button type="button" onClick={() => inputRef.current?.click()} title="Replace"
              className="w-6 h-6 flex items-center justify-center rounded text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={handleRemove} title="Remove"
              className="w-6 h-6 flex items-center justify-center rounded text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" name={name} accept="image/*,application/pdf"
        onChange={handleFileChange} className="hidden" />

      {/* Preview modal */}
      {showPreview && previewSrc && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowPreview(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label} preview</span>
              <button type="button" onClick={() => setShowPreview(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <img src={previewSrc} alt={label}
                className="w-full max-h-64 sm:max-h-72 object-contain rounded-lg" />
            </div>
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <a href={previewSrc} target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-indigo-500 hover:underline">
                Open full size ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
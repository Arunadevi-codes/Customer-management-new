import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Eye, FileText } from "lucide-react";
// ✅ Import PhoneInput alongside the others
import { SectionTitle, Field, TextInput, PhoneInput, SelectInput } from "./accountSettingsUI";

const BASE_URL = "http://localhost:5000";

// ── Build full URL from stored path (e.g. "uploads/aadhar/file.jpg") ──
const buildUrl = (storedPath) => {
  if (!storedPath) return null;
  const clean = storedPath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BASE_URL}/${clean}`;
};

// ── Document image with preview lightbox ──────────────────────
const DocPreview = ({ label, storedPath }) => {
  const [lightbox, setLightbox] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!storedPath) return null;

  const src = buildUrl(storedPath);

  return (
    <>
      {/* ── Thumbnail + View button ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 h-52 relative group">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
            <FileText size={32} />
            <span className="text-xs">Could not load image</span>
          </div>
        ) : (
          <img
            src={src}
            alt={label}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}

        {/* Hover overlay with View button */}
        {!imgError && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-100 text-xs font-semibold shadow"
            >
              <Eye size={13} />
              View {label}
            </button>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && createPortal(
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setLightbox(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{label}</span>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Image */}
            <div className="p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-950 min-h-[160px]">
              <img
                src={src}
                alt={label}
                className="w-full max-h-64 sm:max-h-80 md:max-h-96 object-contain rounded-lg"
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-orange-500 dark:text-orange-400 hover:underline"
              >
                Open full size ↗
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

// ── Sections ──────────────────────────────────────────────────

export const PersonalSection = ({ form, profile, handleField, handleStateChange, editing, states, cities, locationLoading }) => (
  <>
    <SectionTitle title="Personal Details" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

      <Field label="Full Name">
        <TextInput name="fullName" value={form.fullName} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Email">
        <TextInput name="email" value={form.email || profile?.email || ""} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Login Email">
        <TextInput value={form.loginEmail} disabled />
      </Field>

      {/* ✅ Phone — numbers only, max 10 digits */}
      <Field label="Phone">
        <PhoneInput name="phone" value={form.phone} onChange={handleField} disabled={!editing} />
      </Field>

      {/* ✅ Emergency Contact — numbers only, max 10 digits */}
      <Field label="Emergency Contact">
        <PhoneInput name="emergencyContact" value={form.emergencyContact} onChange={handleField} disabled={!editing} />
      </Field>

      <Field label="Gender">
        <SelectInput name="gender" value={form.gender} onChange={handleField} disabled={!editing}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </SelectInput>
      </Field>
      <Field label="Date Of Birth">
        <TextInput type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Address">
        <TextInput name="addressLine" value={form.addressLine} onChange={handleField} disabled={!editing} />
      </Field>

      <Field label="State">
        <SelectInput name="state" value={form.state} onChange={handleStateChange} disabled={!editing || locationLoading.states}>
          <option value="">{locationLoading.states ? "Loading states..." : "Select State"}</option>
          {states.map((s) => (
            <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
          ))}
        </SelectInput>
      </Field>

      <Field label="City">
        <SelectInput name="city" value={form.city} onChange={handleField} disabled={!editing || locationLoading.cities || !form.state}>
          <option value="">
            {!form.state ? "Select state first" : locationLoading.cities ? "Loading cities..." : "Select City"}
          </option>
          {cities.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
          ))}
        </SelectInput>
      </Field>

      <Field label="Pincode">
        <TextInput name="pincode" value={form.pincode} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="Country">
        <TextInput name="country" value={form.country} onChange={handleField} disabled={!editing} />
      </Field>
    </div>
  </>
);

export const JobSection = ({ form, handleField, editing }) => (
  <>
    <SectionTitle title="Job Details" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <Field label="Role"><TextInput value={form.role} disabled /></Field>
      <Field label="Employee ID"><TextInput value={form.employeeId} disabled /></Field>
      <Field label="Joining Date">
        <TextInput type="date" name="dateOfJoining" value={form.dateOfJoining} onChange={handleField} disabled={!editing} />
      </Field>
    </div>
  </>
);

export const DocumentsSection = ({ form, profile, handleField, editing }) => (
  <>
    <SectionTitle title="Documents" />
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* ── Aadhar ── */}
      <div className="space-y-3 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#171717]">
        <Field label="Aadhar Number">
          <TextInput name="aadhar" value={form.aadhar} onChange={handleField} disabled={!editing} />
        </Field>
        <DocPreview label="Aadhar Document" storedPath={profile?.aadharImage} />
      </div>

      {/* ── PAN ── */}
      <div className="space-y-3 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#171717]">
        <Field label="PAN Number">
          <TextInput name="pan" value={form.pan} onChange={handleField} disabled={!editing} />
        </Field>
        <DocPreview label="PAN Document" storedPath={profile?.panImage} />
      </div>

      <Field label="Account Number">
        <TextInput name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleField} disabled={!editing} />
      </Field>
      <Field label="IFSC Code">
        <TextInput name="ifscCode" value={form.ifscCode} onChange={handleField} disabled={!editing} />
      </Field>
    </div>
  </>
);
import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  X, User, Mail, Phone, MapPin, Calendar,
  Briefcase, IdCard, Activity, AlertCircle,
  CreditCard, Building2, FileText, Globe, Eye,
} from "lucide-react";
import { getStateName, getCityName, formatDate, SectionLabel, Detail } from "./staffPopupHelpers";

const BASE_URL = "http://localhost:5000";

// ── Build a full URL from a stored file path ───────────────────
// upload.js uses file.path which multer sets to e.g. "uploads/aadhar/123-doc.jpg"
// So the correct full URL is:  BASE_URL + "/" + storedPath
const buildUrl = (storedPath) => {
  if (!storedPath) return null;
  // Normalise Windows backslashes → forward slashes, strip any leading slash
  const clean = storedPath.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${BASE_URL}/${clean}`;
};

// ── Inline document image viewer ──────────────────────────────
const DocImage = ({ label, storedPath }) => {
  const [lightbox, setLightbox] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!storedPath) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-dashed border-gray-200 dark:border-gray-700">
        <FileText size={14} className="text-gray-300 dark:text-gray-600 shrink-0" />
        <span className="text-xs text-gray-400 dark:text-gray-500">No {label} uploaded</span>
      </div>
    );
  }

  const src = buildUrl(storedPath);
  // Show only the filename part (not the folder path) in the UI
  const displayName = storedPath.replace(/\\/g, "/").split("/").pop();

  return (
    <>
      {/* ── Thumbnail row ── */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-50/60 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/40">

        {imgError ? (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center shrink-0">
            <FileText size={18} className="text-gray-400 dark:text-gray-500" />
          </div>
        ) : (
          <img
            src={src}
            alt={label}
            onError={() => setImgError(true)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover border border-indigo-200 dark:border-indigo-700 shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-300 truncate mt-0.5">
            {displayName}
          </p>
          {imgError && (
            <p className="text-[10px] text-red-400 dark:text-red-500 mt-0.5">
              Could not load image
            </p>
          )}
        </div>

        <button
          onClick={() => !imgError && setLightbox(true)}
          disabled={imgError}
          className={`shrink-0 flex items-center gap-1 text-[11px] font-medium transition-colors px-2 py-1 rounded-md
            ${imgError
              ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
              : "text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800/40"
            }`}
        >
          <Eye size={13} />
          <span className="hidden sm:inline">View</span>
        </button>
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
                className="text-xs font-medium text-indigo-500 dark:text-indigo-400 hover:underline"
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

// ── Main popup ─────────────────────────────────────────────────
const StaffPOPup = ({ staff, onClose }) => {
  if (!staff) return null;

  // Profile image — stored as "uploads/staff/filename.jpg" by upload.js
  const profileSrc = buildUrl(staff.profileImage);

  const roleLabel = staff.role
    ? staff.role.charAt(0).toUpperCase() + staff.role.slice(1)
    : "—";

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-end sm:items-center z-[999] p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-[95%] sm:w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-t-2xl p-4 sm:p-5 text-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 hover:bg-white/20 rounded-full p-1.5 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
              {profileSrc ? (
                <img src={profileSrc} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <User size={22} />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold truncate">{staff.fullName || "—"}</h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-indigo-100">{staff.employeeId || "—"}</span>
                <span className="text-indigo-300">·</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  staff.status === "active"
                    ? "bg-green-400/20 text-green-200"
                    : "bg-red-400/20 text-red-200"
                }`}>
                  {staff.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-4 sm:p-5 space-y-1">

          <SectionLabel label="Personal Info" />
          <Detail icon={<Mail size={16} />}        label="Email"             value={staff.email} />
          <Detail icon={<Phone size={16} />}       label="Phone"             value={staff.phone} />
          <Detail icon={<AlertCircle size={16} />} label="Emergency Contact" value={staff.emergencyContact} />
          <Detail icon={<User size={16} />}        label="Gender"            value={staff.gender} />
          <Detail icon={<Calendar size={16} />}    label="Date of Birth"     value={formatDate(staff.dateOfBirth)} />

          <SectionLabel label="Job Details" />
          <Detail icon={<Briefcase size={16} />}  label="Role"            value={roleLabel} />
          <Detail icon={<IdCard size={16} />}     label="Employee ID"     value={staff.employeeId} />
          <Detail icon={<Calendar size={16} />}   label="Date of Joining" value={formatDate(staff.dateOfJoining)} />
          <Detail icon={<Activity size={16} />}   label="Status"          value={staff.status === "active" ? "Active" : "Inactive"} />
          <Detail icon={<Calendar size={16} />}   label="Account Created" value={formatDate(staff.createdAt)} />

          <SectionLabel label="Address" />
          <Detail icon={<MapPin size={16} />}    label="Street Address" value={staff.addressLine} />
          <Detail icon={<Building2 size={16} />} label="City / State"   value={`${getCityName(staff.state, staff.city)}, ${getStateName(staff.state)}`} />
          <Detail icon={<MapPin size={16} />}    label="Pincode"        value={staff.pincode} />
          <Detail icon={<Globe size={16} />}     label="Country"        value={staff.country} />

          <SectionLabel label="Documents & Banking" />
          <Detail icon={<IdCard size={16} />}     label="Aadhar"         value={staff.aadhar} />
          <Detail icon={<FileText size={16} />}   label="PAN"            value={staff.pan} />
          <Detail icon={<CreditCard size={16} />} label="Account Number" value={staff.bankAccountNumber} />
          <Detail icon={<Building2 size={16} />}  label="IFSC Code"      value={staff.ifscCode} />

          {/* ── Document Images ── */}
          <SectionLabel label="Document Images" />
          <div className="space-y-2 pb-1">
            <DocImage label="Aadhar Document" storedPath={staff.aadharImage} />
            <DocImage label="PAN Document"    storedPath={staff.panImage} />
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
};

export default StaffPOPup;
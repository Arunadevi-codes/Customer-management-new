import React from "react";
import { createPortal } from "react-dom";
import {
  X, User, Mail, Phone, MapPin, Calendar,
  Briefcase, IdCard, Activity, AlertCircle,
  CreditCard, Building2, FileText, Globe,
} from "lucide-react";
import { getStateName, getCityName, formatDate, SectionLabel, Detail } from "./staffPOPup1";

const StaffPOPup = ({ staff, onClose }) => {
  if (!staff) return null;

  const imageUrl = staff.profileImage
    ? `http://localhost:5000/uploads/staff/${staff.profileImage}`
    : null;

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
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-t-2xl p-4 sm:p-5 text-white sticky top-0 z-10">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 hover:bg-white/20 rounded-full p-1.5 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center flex-shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt="profile" className="w-full h-full object-cover" />
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

        {/* Content */}
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
        </div>
      </div>
    </div>,
    document.body
  );
};

export default StaffPOPup;
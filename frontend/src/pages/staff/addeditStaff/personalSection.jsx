import React from 'react';
import { User, Mail, Phone, AlertCircle, Calendar, Upload } from 'lucide-react';
import FormField, { inputBase } from '../../../components/ui/formField';
import SectionDivider from '../../../components/ui/sectionDivider';

// Today's date in YYYY-MM-DD format — used to block future dates in DOB picker
const today = new Date().toISOString().split('T')[0];

const PersonalSection = ({ form, handleChange, errors = {} }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleChange({ target: { name: 'profileImage', files: [file] } });
  };

  const imageSrc = form.profileImage instanceof File
    ? URL.createObjectURL(form.profileImage)
    : form.profileImage
      ? `http://localhost:5000/${form.profileImage}`
      : null;

  return (
    <>
      {/* Profile Photo */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-indigo-50 dark:bg-indigo-900/30 border-2 border-dashed border-indigo-200 dark:border-indigo-700 shadow-sm">
            {imageSrc ? (
              <img src={imageSrc} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-indigo-300 dark:text-indigo-600" />
              </div>
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl p-1.5 cursor-pointer shadow-lg transition-all duration-200 hover:scale-110">
            <Upload className="w-3.5 h-3.5 text-white" />
            <input type="file" name="profileImage" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">Click icon to upload photo</p>
      </div>

      {/* Personal Info Fields */}
      <div className="space-y-4">
        <SectionDivider label="Personal Info" />

        <FormField label="Full Name" required icon={User} error={errors.fullName}>
  <input
    type="text" name="fullName" placeholder="John Doe"
    value={form.fullName || ''} onChange={handleChange}
    className={`${inputBase} ${errors.fullName ? 'border-red-400 dark:border-red-500' : ''}`}
  />
</FormField>

        <FormField label="Email Address" required icon={Mail} error={errors.email}>
          <input
            type="email" name="email" placeholder="john@example.com"
            value={form.email || ''} onChange={handleChange}
            className={`${inputBase} ${errors.email ? 'border-red-400 dark:border-red-500' : ''}`}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Phone" required icon={Phone} error={errors.phone}>
            <input
              type="tel" name="phone" placeholder="+91 98765 43210"
              value={form.phone || ''} onChange={handleChange}
              className={`${inputBase} ${errors.phone ? 'border-red-400 dark:border-red-500' : ''}`}
            />
          </FormField>
          <FormField label="Emergency Contact" icon={AlertCircle}>
  <input
    type="tel" name="emergencyContact" placeholder="Emergency number"
    value={form.emergencyContact || ''} onChange={handleChange}
    className={inputBase}
  />
</FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Gender" required icon={User} error={errors.gender}>
            <select
              name="gender" value={form.gender || ''} onChange={handleChange}
              className={`${inputBase} appearance-none ${errors.gender ? 'border-red-400 dark:border-red-500' : ''}`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

          <FormField label="Date of Birth" required icon={Calendar} error={errors.dateOfBirth}>
  <input
    type="date" name="dateOfBirth"
    value={form.dateOfBirth || ''} onChange={handleChange}
    max={today}
    className={`${inputBase} [&::-webkit-calendar-picker-indicator]:dark:invert ${errors.dateOfBirth ? 'border-red-400 dark:border-red-500' : ''}`}
  />
</FormField>
        </div>
      </div>
    </>
  );
};

export default PersonalSection;
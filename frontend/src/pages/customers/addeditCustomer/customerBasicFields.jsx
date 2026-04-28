import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

const CustomerBasicFields = ({ formData, handleInputChange }) => (
  <div className="space-y-5">
    {/* Name Field */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <User size={18} className="text-indigo-600" />
        Full Name <span className="text-red-500">*</span>
      </label>
      <input 
        name="name" 
        value={formData.name} 
        onChange={handleInputChange}
        placeholder="Enter full name"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
      />
    </div>

    {/* Email Field */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Mail size={18} className="text-indigo-600" />
        Email Address <span className="text-red-500">*</span>
      </label>
      <input 
        type="email"
        name="email" 
        value={formData.email} 
        onChange={handleInputChange}
        placeholder="customer@example.com"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
      />
    </div>

    {/* Phone Field */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Phone size={18} className="text-indigo-600" />
        Phone Number <span className="text-red-500">*</span>
      </label>
      <input 
        type="tel"
        name="phone" 
        value={formData.phone} 
        onChange={handleInputChange}
        placeholder="10-digit mobile number"
        maxLength="10"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm"
      />
    </div>
  </div>
);

export default CustomerBasicFields;
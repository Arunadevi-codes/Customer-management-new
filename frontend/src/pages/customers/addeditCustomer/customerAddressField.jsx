import React from 'react';
import { MapPin, Building, Globe, Home, Loader2, ChevronLeft } from 'lucide-react';

const CustomerAddressFields = ({
  formData,
  states,
  cities,
  loading,
  handleInputChange,
  handleStateChange
}) => (
  <div className="space-y-5">
    {/* Street Field */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Home size={18} className="text-indigo-600" />
        Street Address
      </label>
      <input 
        name="street" 
        value={formData.street} 
        onChange={handleInputChange}
        placeholder="House no., Street, Area"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all text-sm"
      />
    </div>

    {/* State Field */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Building size={18} className="text-indigo-600" />
        State <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select 
          value={formData.state} 
          onChange={handleStateChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all appearance-none text-sm cursor-pointer"
          disabled={loading.states}
        >
          <option value="">{loading.states ? "Loading states..." : "Select State"}</option>
          {states.map(s => (
            <option key={s._id || s.id} value={s._id || s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <ChevronLeft size={16} className="text-indigo-600 absolute right-3 top-3.5 pointer-events-none" />
        {loading.states && (
          <Loader2 size={14} className="animate-spin text-gray-400 absolute right-3 top-3.5" />
        )}
      </div>
    </div>

    {/* City Field */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <Globe size={18} className="text-indigo-600" />
        City <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <select 
          name="city"
          value={formData.city} 
          onChange={handleInputChange}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all appearance-none text-sm cursor-pointer"
          disabled={loading.cities || !formData.state}
        >
          <option value="">
            {!formData.state 
              ? "Select state first" 
              : loading.cities 
                ? "Loading cities..." 
                : "Select City"}
          </option>
          {cities.map(c => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronLeft size={16} className="text-indigo-600 absolute right-3 top-3.5 pointer-events-none" />
        {loading.cities && (
          <Loader2 size={14} className="animate-spin text-gray-400 absolute right-3 top-3.5" />
        )}
      </div>
    </div>

    {/* Pincode Field */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
        <MapPin size={18} className="text-indigo-600" />
        Pincode
      </label>
      <input 
        name="pincode" 
        value={formData.pincode} 
        onChange={handleInputChange}
        placeholder="6-digit pincode"
        maxLength="6"
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all text-sm"
      />
    </div>
  </div>
);

export default CustomerAddressFields;
import React from 'react';
import { MapPin, Building, Globe, Home, Loader2, ChevronLeft } from 'lucide-react';
import FormField, { inputBasePlain } from '../../../components/ui/formField';

const CustomerAddressFields = ({
  formData,
  states,
  cities,
  loading,
  handleInputChange,
  handleStateChange,
}) => (
  <div className="space-y-5">

    {/* Street */}
    <FormField label="Street Address" icon={Home}>
      <input
        name="street"
        value={formData.street}
        onChange={handleInputChange}
        placeholder="House no., Street, Area"
        className={inputBasePlain}
      />
    </FormField>

    {/* State */}
    <FormField label="State" icon={Building} required>
      <div className="relative">
        <select
          value={formData.state}
          onChange={handleStateChange}
          disabled={loading.states}
          className={`${inputBasePlain} appearance-none cursor-pointer`}
        >
          <option value="">
            {loading.states ? 'Loading states...' : 'Select State'}
          </option>
          {states.map((s) => (
            <option key={s._id || s.id} value={s._id || s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {loading.states
          ? <Loader2 size={14} className="animate-spin text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
          : <ChevronLeft size={16} className="text-indigo-600 absolute right-3 top-3.5 pointer-events-none" />
        }
      </div>
    </FormField>

    {/* City */}
    <FormField label="City" icon={Globe} required>
      <div className="relative">
        <select
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          disabled={loading.cities || !formData.state}
          className={`${inputBasePlain} appearance-none cursor-pointer`}
        >
          <option value="">
            {!formData.state
              ? 'Select state first'
              : loading.cities
                ? 'Loading cities...'
                : 'Select City'}
          </option>
          {cities.map((c) => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {loading.cities
          ? <Loader2 size={14} className="animate-spin text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
          : <ChevronLeft size={16} className="text-indigo-600 absolute right-3 top-3.5 pointer-events-none" />
        }
      </div>
    </FormField>

    {/* Pincode */}
    <FormField label="Pincode" icon={MapPin}>
      <input
        name="pincode"
        value={formData.pincode}
        onChange={handleInputChange}
        placeholder="6-digit pincode"
        maxLength="6"
        className={inputBasePlain}
      />
    </FormField>

  </div>
);

export default CustomerAddressFields;
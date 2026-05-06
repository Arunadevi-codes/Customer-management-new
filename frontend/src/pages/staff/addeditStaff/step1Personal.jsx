import React from 'react';
import { MapPin, Building2, MapPinned, Globe } from 'lucide-react';
import { Field, SectionDivider, inputBase } from './formUI';
import PersonalSection from './personalSection';

const Step1Personal = ({ form, handleChange, states, cities, loading, handleStateChange, errors = {} }) => {
  return (
    <div className="w-full max-w-lg mx-auto px-1 py-4 space-y-6">

      {/* Personal Info + Photo */}
      <PersonalSection form={form} handleChange={handleChange} errors={errors} />

      {/* Section: Address */}
      <div className="space-y-4">
        <SectionDivider label="Address" />

        <Field label="Street Address" required icon={MapPin} error={errors.address}>
          <textarea
            name="address"
            placeholder="Street address, area..."
            value={form.address || ''}
            onChange={handleChange}
            rows={2}
            className={`${inputBase} resize-none !pt-2.5 ${errors.address ? 'border-red-400 dark:border-red-500' : ''}`}
            style={{ paddingTop: '0.625rem' }}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* STATE */}
          <Field label="State" required icon={MapPinned} error={errors.state}>
            <select
              value={form.state || ""}
              onChange={handleStateChange}
              className={`${inputBase} appearance-none ${errors.state ? 'border-red-400 dark:border-red-500' : ''}`}
              disabled={loading?.states}
            >
              <option value="">
                {loading?.states ? "Loading states..." : "Select State"}
              </option>
              {states?.map((s) => (
                <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
              ))}
            </select>
          </Field>

          {/* CITY */}
          <Field label="City" required icon={Building2} error={errors.city}>
            <select
              name="city"
              value={form.city || ""}
              onChange={handleChange}
              className={`${inputBase} appearance-none ${errors.city ? 'border-red-400 dark:border-red-500' : ''}`}
              disabled={loading?.cities || !form.state}
            >
              <option value="">
                {!form.state ? "Select state first" : loading?.cities ? "Loading cities..." : "Select City"}
              </option>
              {cities?.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Pincode" icon={MapPin}>
            <input type="text" name="pincode" placeholder="Pincode / ZIP" value={form.pincode || ''} onChange={handleChange} className={inputBase} />
          </Field>
          <Field label="Country" required icon={Globe} error={errors.country}>
            <input
              type="text" name="country" placeholder="Country"
              value={form.country || ''} onChange={handleChange}
              className={`${inputBase} ${errors.country ? 'border-red-400 dark:border-red-500' : ''}`}
            />
          </Field>
        </div>
      </div>

    </div>
  );
};

export default Step1Personal;
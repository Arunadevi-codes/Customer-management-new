import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import FormField, { inputBasePlain } from '../../../components/ui/formField';

const CustomerBasicFields = ({ formData, handleInputChange }) => (
  <div className="space-y-5">

    <FormField label="Full Name" icon={User} required>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Enter full name"
        className={inputBasePlain}
      />
    </FormField>

    <FormField label="Email Address" icon={Mail} required>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="customer@example.com"
        className={inputBasePlain}
      />
    </FormField>

    <FormField label="Phone Number" icon={Phone} required>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="10-digit mobile number"
        maxLength="10"
        className={inputBasePlain}
      />
    </FormField>

  </div>
);

export default CustomerBasicFields;
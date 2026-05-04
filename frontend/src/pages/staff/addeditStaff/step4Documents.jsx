import React, { useState } from 'react';
import { IdCard, FileText, CreditCard, Building2 } from 'lucide-react';
import { Field, SectionDivider, inputBase } from './docFormUI';
import {
  validateAadhar, validatePAN, validateIFSC,
  makeAadharHandler, makePANHandler, makeIFSCHandler, makeAccountHandler,
} from './docValidators';

const Step4Documents = ({ form, handleChange }) => {
  const [showAadhar, setShowAadhar] = useState(false);
  const [showPAN, setShowPAN] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const cleanAadhar = form.aadhar?.replace(/\D/g, '') || '';
  const cleanPAN    = form.pan?.replace(/\s/g, '')    || '';
  const cleanIFSC   = form.ifsc?.replace(/\s/g, '')   || '';

  const borderClass = (valid) =>
    valid ? 'border-green-400 dark:border-green-700' : 'border-red-400 dark:border-red-700';

  return (
    <div className="w-full max-w-lg mx-auto px-1 py-4 space-y-6">

      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Documents & Banking
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Government IDs and bank account details
        </p>
      </div>

      {/* Government IDs */}
      <div className="space-y-4">
        <SectionDivider label="Government IDs" />

        <Field label="Aadhar Number" required icon={IdCard}
          toggle showValue={showAadhar} onToggle={() => setShowAadhar(!showAadhar)}
          validation={cleanAadhar ? {
            valid: validateAadhar(cleanAadhar),
            message: validateAadhar(cleanAadhar) ? 'Valid Aadhar number' : 'Must be exactly 12 digits'
          } : null}
        >
          <input
            type={showAadhar ? 'text' : 'password'}
            name="aadhar"
            value={form.aadhar ? form.aadhar.replace(/(\d{4})(?=\d)/g, '$1 ') : ''}
            onChange={makeAadharHandler(handleChange)}
            placeholder="1234 5678 9012"
            maxLength={14}
            className={`${inputBase} ${cleanAadhar ? borderClass(validateAadhar(cleanAadhar)) : ''}`}
          />
        </Field>

        <Field label="PAN Number" required icon={FileText}
          toggle showValue={showPAN} onToggle={() => setShowPAN(!showPAN)}
          validation={cleanPAN ? {
            valid: validatePAN(cleanPAN),
            message: validatePAN(cleanPAN) ? 'Valid PAN number' : 'Format: ABCDE1234F'
          } : null}
        >
          <input
            type={showPAN ? 'text' : 'password'}
            name="pan"
            value={form.pan || ''}
            onChange={makePANHandler(handleChange)}
            placeholder="ABCDE1234F"
            maxLength={10}
            className={`${inputBase} uppercase ${cleanPAN ? borderClass(validatePAN(cleanPAN)) : ''}`}
          />
        </Field>
      </div>

      {/* Bank Account */}
      <div className="space-y-4">
        <SectionDivider label="Bank Account" />

        <Field label="Account Number" required icon={CreditCard}
          toggle showValue={showAccount} onToggle={() => setShowAccount(!showAccount)}
        >
          <input
            type={showAccount ? 'text' : 'password'}
            name="accountNumber"
            value={form.accountNumber || ''}
            onChange={makeAccountHandler(handleChange)}
            placeholder="Enter bank account number"
            maxLength={18}
            className={inputBase}
          />
        </Field>

        <Field label="IFSC Code" required icon={Building2}
          validation={cleanIFSC ? {
            valid: validateIFSC(cleanIFSC),
            message: validateIFSC(cleanIFSC) ? 'Valid IFSC code' : 'Invalid IFSC — e.g. SBIN0001234'
          } : null}
        >
          <input
            type="text"
            name="ifsc"
            value={form.ifsc || ''}
            onChange={makeIFSCHandler(handleChange)}
            placeholder="SBIN0001234"
            maxLength={11}
            className={`${inputBase} pr-4 uppercase ${cleanIFSC ? borderClass(validateIFSC(cleanIFSC)) : ''}`}
          />
        </Field>
      </div>

    </div>
  );
};

export default Step4Documents;
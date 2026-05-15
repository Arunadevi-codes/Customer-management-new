import React, { useState } from 'react';
import { IdCard, FileText, CreditCard, Building2 } from 'lucide-react';
import {
  SectionDivider,
  docInputBase, DocField, DocValidationHint, EyeToggle, DocImageUpload,
} from './docFormUI';
import {
  validateAadhar, validatePAN, validateIFSC,
  makeAadharHandler, makePANHandler, makeIFSCHandler, makeAccountHandler,
} from './docValidators';

const BASE_URL = "http://localhost:5000";

const validBorder = (ok) =>
  ok ? 'border-emerald-400 dark:border-emerald-600' : 'border-red-400 dark:border-red-600';

const Step4Documents = ({ form, handleChange, errors = {} }) => {
  const [showAadhar,  setShowAadhar]  = useState(false);
  const [showPAN,     setShowPAN]     = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const cleanAadhar = form.aadhar?.replace(/\D/g, '')   || '';
  const cleanPAN    = form.pan?.replace(/\s/g, '')       || '';
  const cleanIFSC   = form.ifscCode?.replace(/\s/g, '') || '';

  // ✅ Build full URL for existing stored image paths
  const buildUrl = (storedPath) => {
    if (!storedPath) return null;
    if (storedPath instanceof File) return URL.createObjectURL(storedPath);
    const clean = storedPath.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${BASE_URL}/${clean}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto px-1 py-4 space-y-5">

      <div className="text-center">
        <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white tracking-tight">Documents &amp; Banking</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Government IDs and bank account details</p>
      </div>

      <div className="space-y-4">
        <SectionDivider label="Government IDs" />

        {/* ── Aadhar ── */}
        <DocField label="Aadhar Number" required icon={IdCard}>
          <div className="flex items-center gap-1.5">
            <input
              name="aadhar"
              type={showAadhar ? 'text' : 'password'}
              value={form.aadhar ? form.aadhar.replace(/(\d{4})(?=\d)/g, '$1 ') : ''}
              onChange={makeAadharHandler(handleChange)}
              placeholder="1234 5678 9012"
              maxLength={14}
              className={`${docInputBase} ${
                errors.aadhar
                  ? 'border-red-400 dark:border-red-600'
                  : cleanAadhar
                    ? validBorder(validateAadhar(cleanAadhar))
                    : ''
              }`}
            />
            <EyeToggle show={showAadhar} onToggle={() => setShowAadhar(v => !v)} />
          </div>
          {cleanAadhar && !errors.aadhar && (
            <DocValidationHint
              valid={validateAadhar(cleanAadhar)}
              message={validateAadhar(cleanAadhar) ? 'Valid Aadhar number' : 'Must be exactly 12 digits'}
            />
          )}
          {errors.aadhar && <DocValidationHint valid={false} message={errors.aadhar} />}

          {/* ✅ Pass existingUrl so existing aadhar image is shown when editing */}
          <DocImageUpload
            label="Aadhar"
            name="aadharImage"
            value={form.aadharImage}
            existingUrl={buildUrl(form.aadharImage)}
            onChange={handleChange}
          />
          {errors.aadharImage && <DocValidationHint valid={false} message={errors.aadharImage} />}
        </DocField>

        {/* ── PAN ── */}
        <DocField label="PAN Number" required icon={FileText}>
          <div className="flex items-center gap-1.5">
            <input
              name="pan"
              type={showPAN ? 'text' : 'password'}
              value={form.pan || ''}
              onChange={makePANHandler(handleChange)}
              placeholder="ABCDE1234F"
              maxLength={10}
              style={{ textTransform: 'uppercase' }}
              className={`${docInputBase} ${
                errors.pan
                  ? 'border-red-400 dark:border-red-600'
                  : cleanPAN
                    ? validBorder(validatePAN(cleanPAN))
                    : ''
              }`}
            />
            <EyeToggle show={showPAN} onToggle={() => setShowPAN(v => !v)} />
          </div>
          {cleanPAN && !errors.pan && (
            <DocValidationHint
              valid={validatePAN(cleanPAN)}
              message={validatePAN(cleanPAN) ? 'Valid PAN number' : 'Format: ABCDE1234F'}
            />
          )}
          {errors.pan && <DocValidationHint valid={false} message={errors.pan} />}

          {/* ✅ Pass existingUrl so existing PAN image is shown when editing */}
          <DocImageUpload
            label="PAN"
            name="panImage"
            value={form.panImage}
            existingUrl={buildUrl(form.panImage)}
            onChange={handleChange}
          />
          {errors.panImage && <DocValidationHint valid={false} message={errors.panImage} />}
        </DocField>
      </div>

      <div className="space-y-4">
        <SectionDivider label="Bank Account" />

        {/* ── Account Number ── */}
        <DocField label="Account Number" required icon={CreditCard}>
          <div className="flex items-center gap-1.5">
            <input
              type={showAccount ? 'text' : 'password'}
              name="bankAccountNumber"
              value={form.bankAccountNumber || ''}
              onChange={makeAccountHandler(handleChange)}
              placeholder="Enter bank account number"
              maxLength={18}
              className={`${docInputBase} ${
                errors.bankAccountNumber ? 'border-red-400 dark:border-red-600' : ''
              }`}
            />
            <EyeToggle show={showAccount} onToggle={() => setShowAccount(v => !v)} />
          </div>
          {errors.bankAccountNumber && <DocValidationHint valid={false} message={errors.bankAccountNumber} />}
        </DocField>

        {/* ── IFSC ── */}
        <DocField label="IFSC Code" required icon={Building2}>
          <input
            type="text"
            name="ifscCode"
            value={form.ifscCode || ''}
            onChange={makeIFSCHandler(handleChange)}
            placeholder="SBIN0001234"
            maxLength={11}
            style={{ textTransform: 'uppercase' }}
            className={`${docInputBase} ${
              errors.ifscCode
                ? 'border-red-400 dark:border-red-600'
                : cleanIFSC
                  ? validBorder(validateIFSC(cleanIFSC))
                  : ''
            }`}
          />
          {cleanIFSC && !errors.ifscCode && (
            <DocValidationHint
              valid={validateIFSC(cleanIFSC)}
              message={validateIFSC(cleanIFSC) ? 'Valid IFSC code' : 'Invalid IFSC — e.g. SBIN0001234'}
            />
          )}
          {errors.ifscCode && <DocValidationHint valid={false} message={errors.ifscCode} />}
        </DocField>
      </div>

    </div>
  );
};

export default Step4Documents;
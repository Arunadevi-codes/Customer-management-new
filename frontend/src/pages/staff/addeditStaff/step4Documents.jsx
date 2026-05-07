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

const validBorder = (ok) =>
  ok ? 'border-emerald-400 dark:border-emerald-600' : 'border-red-400 dark:border-red-600';

const IdField = ({ label, icon, show, onToggle, inputProps, isValid, validation, uploadName, uploadValue, onChange }) => (
  <DocField label={label} required icon={icon}>
    <div className="flex items-center gap-1.5">
      <input {...inputProps} type={show ? 'text' : 'password'}
        className={`${docInputBase} ${isValid !== undefined ? validBorder(isValid) : ''}`} />
      <EyeToggle show={show} onToggle={onToggle} />
    </div>
    {validation && <DocValidationHint valid={validation.valid} message={validation.message} />}
    <DocImageUpload label={label} name={uploadName} value={uploadValue} onChange={onChange} />
  </DocField>
);

const Step4Documents = ({ form, handleChange }) => {
  const [showAadhar,  setShowAadhar]  = useState(false);
  const [showPAN,     setShowPAN]     = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const cleanAadhar = form.aadhar?.replace(/\D/g, '')          || '';
  const cleanPAN    = form.pan?.replace(/\s/g, '')              || '';
  const cleanIFSC   = form.ifscCode?.replace(/\s/g, '')         || ''; // ← was form.ifsc

  return (
    <div className="w-full max-w-lg mx-auto px-1 py-4 space-y-5">

      <div className="text-center">
        <h2 className="text-[17px] font-semibold text-gray-900 dark:text-white tracking-tight">Documents &amp; Banking</h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Government IDs and bank account details</p>
      </div>

      <div className="space-y-4">
        <SectionDivider label="Government IDs" />

        <IdField
          label="Aadhar Number" icon={IdCard}
          show={showAadhar} onToggle={() => setShowAadhar(v => !v)}
          inputProps={{
            name: 'aadhar',
            value: form.aadhar ? form.aadhar.replace(/(\d{4})(?=\d)/g, '$1 ') : '',
            onChange: makeAadharHandler(handleChange),
            placeholder: '1234 5678 9012',
            maxLength: 14,
          }}
          isValid={cleanAadhar ? validateAadhar(cleanAadhar) : undefined}
          validation={cleanAadhar ? {
            valid: validateAadhar(cleanAadhar),
            message: validateAadhar(cleanAadhar) ? 'Valid Aadhar number' : 'Must be exactly 12 digits',
          } : null}
          uploadName="aadharImage" uploadValue={form.aadharImage} onChange={handleChange}
        />

        <IdField
          label="PAN Number" icon={FileText}
          show={showPAN} onToggle={() => setShowPAN(v => !v)}
          inputProps={{
            name: 'pan',
            value: form.pan || '',
            onChange: makePANHandler(handleChange),
            placeholder: 'ABCDE1234F',
            maxLength: 10,
            style: { textTransform: 'uppercase' },
          }}
          isValid={cleanPAN ? validatePAN(cleanPAN) : undefined}
          validation={cleanPAN ? {
            valid: validatePAN(cleanPAN),
            message: validatePAN(cleanPAN) ? 'Valid PAN number' : 'Format: ABCDE1234F',
          } : null}
          uploadName="panImage" uploadValue={form.panImage} onChange={handleChange}
        />
      </div>

      <div className="space-y-4">
        <SectionDivider label="Bank Account" />

        <DocField label="Account Number" required icon={CreditCard}>
          <div className="flex items-center gap-1.5">
            <input
              type={showAccount ? 'text' : 'password'}
              name="bankAccountNumber"                      
              value={form.bankAccountNumber || ''}          
              onChange={makeAccountHandler(handleChange)}
              placeholder="Enter bank account number" maxLength={18}
              className={docInputBase}
            />
            <EyeToggle show={showAccount} onToggle={() => setShowAccount(v => !v)} />
          </div>
        </DocField>

        <DocField label="IFSC Code" required icon={Building2}>
          <input
            type="text"
            name="ifscCode"                                 
            value={form.ifscCode || ''}                     
            onChange={makeIFSCHandler(handleChange)}
            placeholder="SBIN0001234" maxLength={11}
            style={{ textTransform: 'uppercase' }}
            className={`${docInputBase} ${cleanIFSC ? validBorder(validateIFSC(cleanIFSC)) : ''}`}
          />
          {cleanIFSC && (
            <DocValidationHint
              valid={validateIFSC(cleanIFSC)}
              message={validateIFSC(cleanIFSC) ? 'Valid IFSC code' : 'Invalid IFSC — e.g. SBIN0001234'}
            />
          )}
        </DocField>
      </div>

    </div>
  );
};

export default Step4Documents;
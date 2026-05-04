// VALIDATORS
export const validateAadhar = (v) => /^\d{12}$/.test(v);
export const validatePAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.toUpperCase());
export const validateIFSC = (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.toUpperCase());

// MASKED INPUT HANDLERS
export const makeAadharHandler = (handleChange) => (e) => {
  const value = e.target.value.replace(/\D/g, '');
  if (value.length <= 12) handleChange({ target: { name: 'aadhar', value } });
};

export const makePANHandler = (handleChange) => (e) => {
  const value = e.target.value.toUpperCase().replace(/\s/g, '');
  if (value.length <= 10) handleChange({ target: { name: 'pan', value } });
};

export const makeIFSCHandler = (handleChange) => (e) => {
  const value = e.target.value.toUpperCase().replace(/\s/g, '');
  if (value.length <= 11) handleChange({ target: { name: 'ifsc', value } });
};

export const makeAccountHandler = (handleChange) => (e) => {
  const value = e.target.value.replace(/\D/g, '');
  if (value.length <= 18) handleChange({ target: { name: 'accountNumber', value } });
};
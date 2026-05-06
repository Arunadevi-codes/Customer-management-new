// ─────────────────────────────────────────────
//  staffHelper.js  –  Staff-specific utilities
//  Used by: staffReadController, staffWriteController
// ─────────────────────────────────────────────

const Staff = require("../models/Staff");

// ─────────────────────────────────────────────

/**
 * Auto-generate the next sequential Employee ID.
 * Format: EMP0001, EMP0002, …
 *
 * @returns {Promise<string>}  e.g. "EMP0005"
 */
const generateEmployeeId = async () => {
  const lastStaff = await Staff.findOne()
    .sort({ createdAt: -1 })
    .select("employeeId");

  let nextNumber = 1;

  if (lastStaff?.employeeId) {
    const lastNumber = parseInt(lastStaff.employeeId.replace("EMP", ""));
    nextNumber = lastNumber + 1;
  }

  return `EMP${String(nextNumber).padStart(4, "0")}`;
};

// ─────────────────────────────────────────────

/**
 * Map incoming request body fields to the Staff schema shape.
 * Keeps controller code thin and field mapping in one place.
 *
 * @param {object}      data          - req.body
 * @param {string|null} profileImage  - Filename from multer (or null)
 * @returns {object}                  - Staff document fields (no password / employeeId)
 */
const buildStaffData = (data, profileImage) => ({
  // ── Personal Info ──────────────────────────
  fullName:         data.name,
  email:            data.email,
  phone:            data.phone,
  emergencyContact: data.emergencyPhone,
  gender:           data.gender,
  dateOfBirth:      data.dob,
  profileImage:     profileImage || null,

  // ── Address ────────────────────────────────
  addressLine: data.address,
  city:        data.city,
  state:       data.state,
  pincode:     data.pincode,
  country:     data.country,

  // ── Employment ─────────────────────────────
  role:          data.role,
  dateOfJoining: data.joiningDate,
  status:        data.status,
  loginEmail:    data.email,

  // ── Financial / ID ─────────────────────────
  aadhar:            data.aadhar,
  pan:               data.pan,
  bankAccountNumber: data.accountNumber,
  ifscCode:          data.ifsc,
});

// ─────────────────────────────────────────────

/**
 * Handle MongoDB duplicate-key errors and generic server errors uniformly.
 * Calls res.status(...).json(...) and returns the result so callers can `return`.
 *
 * @param {Error}    err
 * @param {object}   res  - Express response object
 * @returns {object}      - Express response
 */
const handleDuplicateError = (err, res) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }

  return res.status(500).json({
    success:   false,
    error:     err.message,
    fullError: err,
  });
};

// ─────────────────────────────────────────────

module.exports = {
  generateEmployeeId,
  buildStaffData,
  handleDuplicateError,
};
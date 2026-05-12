const Staff  = require("../models/Staff");
const bcrypt = require("bcryptjs");
const { generateEmployeeId } = require("../helpers/staffHelper");
const fs   = require("fs");
const path = require("path");

// ── Helpers ────────────────────────────────────────────────────
const deleteFile = (filePath) => {
  if (filePath) fs.unlink(path.resolve(filePath), () => {});
};

const extractFiles = (files = {}) => ({
  profileImage: files.profileImage?.[0]?.path ?? undefined,
  aadharImage:  files.aadharImage?.[0]?.path  ?? undefined,
  panImage:     files.panImage?.[0]?.path      ?? undefined,
});

const sanitizeBody = (body) => {
  const cleaned = {};
  for (const [key, value] of Object.entries(body)) {
    if (value === "" || value === undefined) continue;
    if (["dateOfBirth", "dateOfJoining"].includes(key)) {
      const parsed = new Date(value);
      if (!isNaN(parsed)) cleaned[key] = parsed;
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
};

const formatError = (err, res) => {
  // Duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    const value = err.keyValue?.[field] || "";
    return res.status(400).json({
      message: `${field} "${value}" already exists. Please use a different value.`,
    });
  }
  // Validation errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ message: "Validation failed", errors });
  }
  return res.status(400).json({ message: err.message });
};

// ── CREATE ─────────────────────────────────────────────────────
exports.createStaff = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    const images = extractFiles(req.files);
    const body = sanitizeBody(req.body);

    // Hash password before saving
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const staff = new Staff({
  fullName: body.fullName,
  email: body.email,
  loginEmail: body.loginEmail, // ✅ ADD THIS

  phone: body.phone,
  emergencyContact: body.emergencyContact,
  gender: body.gender,
  dateOfBirth: body.dateOfBirth,

  addressLine: body.addressLine,
  city: body.city,
  state: body.state,
  pincode: body.pincode,
  country: body.country,

  role: body.role,
  employeeId,
  dateOfJoining: body.dateOfJoining,
  status: body.status,

  password: body.password,

  aadhar: body.aadhar,
  pan: body.pan,
  bankAccountNumber: body.bankAccountNumber,
  ifscCode: body.ifscCode,

  ...images,
});
    await staff.save();

    const safeStaff = staff.toObject();
    delete safeStaff.password;

    res.status(201).json(safeStaff);
  } catch (err) {
    formatError(err, res);
  }
};

// ── UPDATE ─────────────────────────────────────────────────────
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const images = extractFiles(req.files);
    const body   = sanitizeBody(req.body);

    // Delete old images if new ones uploaded
    if (images.profileImage) deleteFile(staff.profileImage);
    if (images.aadharImage)  deleteFile(staff.aadharImage);
    if (images.panImage)     deleteFile(staff.panImage);

    // Handle explicit profile image removal
    if (req.body.removeProfileImage === "true" && !images.profileImage) {
      deleteFile(staff.profileImage);
      images.profileImage = null;
    }

    // Hash password if being updated
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      { ...body, ...images },
      { new: true, runValidators: true }   // ← fixed: was returnDocument:'after'
    ).select("-password");

    res.json(updated);
  } catch (err) {
    formatError(err, res);
  }
};

// ── DELETE ─────────────────────────────────────────────────────
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    deleteFile(staff.profileImage);
    deleteFile(staff.aadharImage);
    deleteFile(staff.panImage);

    await staff.deleteOne();
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Delete failed" });
  }
};
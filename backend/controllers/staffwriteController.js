const Staff = require("../models/Staff");
const { generateEmployeeId } = require("../helpers/staffHelper");
const fs = require("fs");
const path = require("path");

const deleteFile = (filePath) => {
  if (filePath) fs.unlink(path.resolve(filePath), () => {});
};

const extractFiles = (files = {}) => ({
  profileImage: files.profileImage?.[0]?.path ?? undefined,
  aadharImage:  files.aadharImage?.[0]?.path  ?? undefined,
  panImage:     files.panImage?.[0]?.path      ?? undefined,
});

// ── Sanitize body: strip empty strings, parse dates ────────────
const sanitizeBody = (body) => {
  const cleaned = {};

  for (const [key, value] of Object.entries(body)) {
    // Skip empty strings so required fields fail clearly
    if (value === "" || value === undefined) continue;

    // Parse known date fields
    if (["dateOfBirth", "dateOfJoining"].includes(key)) {
      const parsed = new Date(value);
      if (!isNaN(parsed)) cleaned[key] = parsed;
      continue;
    }

    cleaned[key] = value;
  }

  return cleaned;
};

// CREATE
exports.createStaff = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    const images = extractFiles(req.files);
    const body   = sanitizeBody(req.body);

    const staff = new Staff({
      ...body,
      employeeId,
      ...images,
    });

    await staff.save();

    const safeStaff = staff.toObject();
    delete safeStaff.password;

    res.status(201).json(safeStaff);
  } catch (err) {
    // Return each validation error clearly
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(400).json({ message: err.message });
  }
};

// UPDATE
// UPDATE
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const images = extractFiles(req.files);
    const body   = sanitizeBody(req.body);

    if (images.profileImage) deleteFile(staff.profileImage);
    if (images.aadharImage)  deleteFile(staff.aadharImage);
    if (images.panImage)     deleteFile(staff.panImage);

    // ✅ If frontend explicitly removed the profile image
    if (req.body.removeProfileImage === "true" && !images.profileImage) {
      deleteFile(staff.profileImage);
      images.profileImage = null; // set to null in DB
    }

    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      { ...body, ...images },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(400).json({ message: err.message });
  }
};

// DELETE
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
    res.status(500).json({
      message: err.message || "Delete failed",
    });
  }
};
const Staff  = require("../models/Staff");
const bcrypt = require("bcryptjs");
const fs     = require("fs");
const path   = require("path");

// ── Helper: safely delete a file from disk ─────────────────────
const deleteFile = (storedPath) => {
  if (!storedPath) return;
  const abs = path.resolve(storedPath.replace(/\\/g, "/"));
  fs.unlink(abs, (err) => {
    if (err) console.warn("Could not delete file:", abs, err.message);
  });
};

// GET /api/staff/profile/me
exports.getMyProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id).select("-password");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/staff/profile/me
exports.updateMyProfile = async (req, res) => {
  try {
    const allowed = [
      "fullName", "phone", "emergencyContact", "gender", "dateOfBirth",
      "addressLine", "city", "state", "pincode", "country",
      "dateOfJoining",
      "aadhar", "pan", "bankAccountNumber", "ifscCode",
      "loginEmail",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    // Fetch current staff so we can delete old image from disk if needed
    const existing = await Staff.findById(req.user.id);
    if (!existing) return res.status(404).json({ message: "Staff not found" });

    // ✅ Remove profile image explicitly (user clicked the X button)
    if (req.body.removeProfileImage === "true" && !req.files?.profileImage?.[0]) {
      deleteFile(existing.profileImage);
      updates.profileImage = null;
    }

    // ✅ Upload new profile image (delete old one first if it exists)
    if (req.files?.profileImage?.[0]) {
      deleteFile(existing.profileImage);
      updates.profileImage = req.files.profileImage[0].path.replace(/\\/g, "/");
    }

    const staff = await Staff.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ staff });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/staff/profile/change-password
exports.changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both fields are required" });

    // password is select:false in schema — must explicitly request it
    const staff = await Staff.findById(req.user.id).select("+password");
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const isMatch = await bcrypt.compare(currentPassword, staff.password);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    staff.password = await bcrypt.hash(newPassword, 10);
    await staff.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
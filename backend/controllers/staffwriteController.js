const fs      = require("fs");
const path    = require("path");
const bcrypt  = require("bcryptjs");

const Staff = require("../models/Staff");

const {
  generateEmployeeId,
  buildStaffData,
  handleDuplicateError,
} = require("../helpers/staffHelper");

//  CREATE
exports.createStaff = async (req, res) => {
  try {
    const data         = req.body;
    const profileImage = req.file ? req.file.filename : null;

    // Use provided employeeId, or auto-generate one
    const employeeId = data.employeeId || await generateEmployeeId();

    // Build the document fields from request body
    const staffData = buildStaffData(data, profileImage);

    staffData.employeeId = employeeId;
    staffData.password   = await bcrypt.hash(data.password, 10);

    const saved = await new Staff(staffData).save();

    const safeStaff = saved.toObject();
    delete safeStaff.password;

    res.json(safeStaff);

  } catch (err) {
    console.log(err);
    return handleDuplicateError(err, res);
  }
};

//  UPDATE
exports.updateStaff = async (req, res) => {
  try {
    const data = req.body;

    // Build update payload from request body
    const updateData = buildStaffData(data, null);

    updateData.employeeId = data.employeeId || undefined;

    // Only hash and update password if a new one was supplied
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    // Replace profile image only if a new file was uploaded
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after", runValidators: true }
    );

    const safeUpdated = updated.toObject();
    delete safeUpdated.password;

    res.json(safeUpdated);

  } catch (err) {
    console.log(err);
    return handleDuplicateError(err, res);
  }
};

//  DELETE
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Remove associated profile image from disk
    if (staff.profileImage) {
      const imgPath = path.join(__dirname, "..", "uploads", "staff", staff.profileImage);
      fs.unlink(imgPath, () => {});
    }

    await Staff.findByIdAndDelete(req.params.id);

    res.json({ message: "Staff deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const Staff = require("../models/Staff");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { generateEmployeeId, buildStaffData, handleDuplicateError } = require("./staffHelper");

// CREATE STAFF
exports.createStaff = async (req, res) => {
  try {
    console.log(req.body);

    const data = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const employeeId = data.employeeId || await generateEmployeeId();
    const staffData = await buildStaffData(data, profileImage);

    staffData.employeeId = employeeId;
    staffData.password = await bcrypt.hash(data.password, 10);

    const staff = new Staff(staffData);
    const saved = await staff.save();

    const safeStaff = saved.toObject();
    delete safeStaff.password;
    res.json(safeStaff);

  } catch (err) {
    console.log(err);
    handleDuplicateError(err, res);
  }
};

// UPDATE STAFF
exports.updateStaff = async (req, res) => {
  try {
    const data = req.body;
    const updateData = await buildStaffData(data, null);

    updateData.employeeId = data.employeeId || undefined;

    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    if (req.file) updateData.profileImage = req.file.filename;

    const updated = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    const safeUpdated = updated.toObject();
    delete safeUpdated.password;
    res.json(safeUpdated);

  } catch (err) {
    console.log(err);
    handleDuplicateError(err, res);
  }
};

// DELETE STAFF
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

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
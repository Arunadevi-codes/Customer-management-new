const Staff = require("../models/Staff");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// CREATE STAFF
exports.createStaff = async (req, res) => {
  try {
   
    console.log(req.body);

    const data = req.body;

    // image from multer
    const profileImage = req.file ? req.file.filename : null;
    let employeeId = data.employeeId;

if (!employeeId) {

  // get latest employee
  const lastStaff = await Staff.findOne()
    .sort({ createdAt: -1 })
    .select("employeeId");

  let nextNumber = 1;

  if (lastStaff?.employeeId) {
    const lastNumber = parseInt(
      lastStaff.employeeId.replace("EMP", "")
    );

    nextNumber = lastNumber + 1;
  }

  employeeId = `EMP${String(nextNumber).padStart(4, "0")}`;
}

    // map frontend fields -> schema fields
    const staffData = {
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      emergencyContact: data.emergencyPhone,
      gender: data.gender,
      dateOfBirth: data.dob,
      profileImage,

      addressLine: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,

      role: data.role,
      employeeId,
      dateOfJoining: data.joiningDate,
      status: data.status,

      loginEmail: data.email,
      password: await bcrypt.hash(data.password, 10),

      aadhar: data.aadhar,
      pan: data.pan,
      bankAccountNumber: data.accountNumber,
      ifscCode: data.ifsc,
    };

    const staff = new Staff(staffData);

    const saved = await staff.save();

    const safeStaff = saved.toObject();

delete safeStaff.password;

res.json(safeStaff);

  } catch (err) {

  console.log(err);

  if (err.code === 11000) {

    const field = Object.keys(err.keyPattern)[0];

    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  return res.status(500).json({
  success: false,
  error: err.message,
  fullError: err,
});
}
};

// GET NEXT EMPLOYEE ID
exports.getNextEmployeeId = async (req, res) => {
  try {
    const lastStaff = await Staff.findOne()
  .sort({ createdAt: -1 })
  .select("employeeId");

let nextNumber = 1;

if (lastStaff?.employeeId) {

  const lastNumber = parseInt(
    lastStaff.employeeId.replace("EMP", "")
  );

  nextNumber = lastNumber + 1;
}

const employeeId = `EMP${String(nextNumber).padStart(4, "0")}`;
    res.json({ employeeId });
  } catch (err) {
    console.error("getNextEmployeeId error:", err); // ← see exact error in terminal
    res.status(500).json({
      message: err.message,
      stack: err.stack, // ← also send to frontend temporarily
    });
  }
};

// GET ALL STAFF
exports.getStaff = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const fromDate = req.query.fromDate;
const toDate = req.query.toDate;

    const query = {};

    // 🔍 search
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = offset * limit;

    // 📅 date filter
if (fromDate || toDate) {

  query.createdAt = {};

  if (fromDate) {
    query.createdAt.$gte = new Date(fromDate);
  }

  if (toDate) {

    const endDate = new Date(toDate);

    endDate.setHours(23, 59, 59, 999);

    query.createdAt.$lte = endDate;
  }
}

    // REPLACE WITH:
const sortField = req.query.sortField || "createdAt";
const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

const isStringField = sortField === "fullName" || sortField === "email" || sortField === "phone";

const query_builder = Staff.find(query)
  .select("-password")
  .sort({ [sortField]: sortOrder })
  .skip(skip)
  .limit(limit);

if (isStringField) {
  query_builder.collation({ locale: "en", strength: 2 });
}

const staffs = await query_builder;

    const total = await Staff.countDocuments(query);

    res.json({ staffs, total });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE STAFF
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const safeStaff = staff.toObject();

delete safeStaff.password;

res.json(safeStaff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE STAFF
exports.updateStaff = async (req, res) => {
  try {

    const data = req.body;

    const updateData = {
      fullName: data.name,
      email: data.email,
      phone: data.phone,
      emergencyContact: data.emergencyPhone,
      gender: data.gender,
      dateOfBirth: data.dob,

      addressLine: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,

      role: data.role,
      employeeId: data.employeeId || undefined,
      dateOfJoining: data.joiningDate,
      status: data.status,

      loginEmail: data.email,

      aadhar: data.aadhar,
      pan: data.pan,
      bankAccountNumber: data.accountNumber,
      ifscCode: data.ifsc,
    };

    // update password only if entered
    if (data.password) {
  updateData.password = await bcrypt.hash(data.password, 10);
}

    // image
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }

    const updated = await Staff.findByIdAndUpdate(
  req.params.id,
  updateData,
  {
    new: true,
    runValidators: true,
  }
);

    const safeUpdated = updated.toObject();

delete safeUpdated.password;

res.json(safeUpdated);

  } catch (err) {

  console.log(err);

  if (err.code === 11000) {

    const field = Object.keys(err.keyPattern)[0];

    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  return res.status(500).json({
  success: false,
  error: err.message,
  fullError: err,
});
}
};

// DELETE STAFF
exports.deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // delete image
    if (staff.profileImage) {
      const imgPath = path.join(
        __dirname,
        "..",
        "uploads",
        "staff",
        staff.profileImage
      );

      fs.unlink(imgPath, () => {});
    }

    await Staff.findByIdAndDelete(req.params.id);

    res.json({ message: "Staff deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
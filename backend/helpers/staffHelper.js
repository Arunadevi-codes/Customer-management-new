const Staff = require("../models/Staff");
const Counter = require("../models/Counter");

const generateEmployeeId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "employeeId",                  // fixed document ID for this counter
    { $inc: { seq: 1 } },          // atomically increment by 1
    { new: true, upsert: true }    // create if doesn't exist
  );
 
  return `EMP${String(counter.seq).padStart(4, "0")}`;
};

// Build staff object
const buildStaffData = (data, profileImage) => ({
  // Personal Info
  fullName: data.name,
  email: data.email,
  phone: data.phone,
  emergencyContact: data.emergencyPhone,
  gender: data.gender,
  dateOfBirth: data.dob,
  profileImage: profileImage || null,

  // Address
  addressLine: data.address,
  city: data.city,
  state: data.state,
  pincode: data.pincode,
  country: data.country,

  // Employment
  role: data.role,
  dateOfJoining: data.joiningDate,
  status: data.status,
  loginEmail: data.email,

  // Bank & ID
  aadhar: data.aadhar,
  pan: data.pan,
  bankAccountNumber: data.accountNumber,
  ifscCode: data.ifsc,
});

// Handle errors
const handleDuplicateError = (err, res) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`,
    });
  }
 
  return res.status(500).json({
    success: false,
    error: err.message,
  });
};
 
module.exports = {
  generateEmployeeId,
  handleDuplicateError,
};
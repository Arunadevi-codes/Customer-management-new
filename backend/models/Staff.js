const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    // STEP 1 - BASIC DETAILS
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    emergencyContact: { type: String },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    profileImage: { type: String, default: null },

    // STEP 2 - ADDRESS
    addressLine: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String },
    country: { type: String, required: true },

    // STEP 3 - JOB INFO
    role: {
      type: String,
      enum: ["admin", "manager", "staff"],
      default: "staff",
    },
    employeeId: { type: String, unique: true },
    dateOfJoining: { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // STEP 4 - LOGIN
    loginEmail: { type: String },
    password: { type: String, required: true, select: false }, // hashed later

    // DOCUMENTS
    aadhar: { type: String },
    pan: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },

    // DOCUMENT IMAGES  
    aadharImage: { type: String, default: null }, 
    panImage: { type: String, default: null },    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
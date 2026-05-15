const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String },
    phone:    { type: String, required: true },
    street:   { type: String },
    state:    { type: String, required: true },
    city:     { type: String, required: true },
    pincode:  { type: String },
    image:    { type: String, default: null },
    // ✅ NEW: staff assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
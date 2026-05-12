const Counter = require("../models/Counter");

// ── GENERATE EMPLOYEE ID (called only on actual create) ────────
const generateEmployeeId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    "employeeId",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `EMP${String(counter.seq).padStart(4, "0")}`;
};

// ── PREVIEW NEXT EMPLOYEE ID (called for display in form) ──────
// Reads counter WITHOUT incrementing — safe to call anytime
const previewNextEmployeeId = async () => {
  const counter = await Counter.findById("employeeId");
  const next = (counter?.seq || 0) + 1;
  return `EMP${String(next).padStart(4, "0")}`;
};

// ── HANDLE DUPLICATE KEY ERROR ─────────────────────────────────
const handleDuplicateError = (err, res) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ message: `${field} already exists` });
  }
  return res.status(500).json({ success: false, error: err.message });
};

module.exports = {
  generateEmployeeId,
  previewNextEmployeeId,
  handleDuplicateError,
};
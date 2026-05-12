const Admin = require("../models/Admin");
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ── ADMIN LOGIN ────────────────────────────────────────────────
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "superadmin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name:     admin.username,
        username: admin.username,
        role:     "superadmin",
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── STAFF LOGIN ────────────────────────────────────────────────
exports.staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    // ✅ Authenticate using loginEmail (credential email), not personal email
    const staff = await Staff.findOne({ loginEmail: email }).select("+password");

    if (!staff)
      return res.status(401).json({ message: "Invalid credentials" });

    if (staff.status !== "active")
      return res.status(403).json({ message: "Your account is inactive. Contact admin." });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: staff.fullName,
        email: staff.loginEmail,   
        role: staff.role,
        employeeId: staff.employeeId,
        profileImage: staff.profileImage,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
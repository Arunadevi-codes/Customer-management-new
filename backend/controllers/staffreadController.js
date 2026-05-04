const Staff = require("../models/Staff");
const { generateEmployeeId } = require("./staffHelper");

// GET NEXT EMPLOYEE ID
exports.getNextEmployeeId = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    res.json({ employeeId });
  } catch (err) {
    console.error("getNextEmployeeId error:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

// GET ALL STAFF
exports.getStaff = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const { fromDate, toDate } = req.query;

    const query = {};

    // SEARCH
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // DATE FILTER
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }

    // SORT
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const isStringField = ["fullName", "email", "phone"].includes(sortField);

    const query_builder = Staff.find(query)
      .select("-password")
      .sort({ [sortField]: sortOrder })
      .skip(offset * limit)
      .limit(limit);

    if (isStringField) query_builder.collation({ locale: "en", strength: 2 });

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
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const safeStaff = staff.toObject();
    delete safeStaff.password;
    res.json(safeStaff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
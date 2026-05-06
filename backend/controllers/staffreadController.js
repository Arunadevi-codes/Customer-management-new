const Staff = require("../models/Staff");

const { generateEmployeeId }            = require("../helpers/staffHelper");
const { buildSearchQuery, buildDateQuery, getPagination, getSortOptions } = require("../helpers/queryHelper");

//  GET NEXT EMPLOYEE ID

exports.getNextEmployeeId = async (req, res) => {
  try {
    const employeeId = await generateEmployeeId();
    res.json({ employeeId });

  } catch (err) {
    console.error("getNextEmployeeId error:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

//  GET ALL  (with search / date filter / sort / pagination)

exports.getStaff = async (req, res) => {
  try {
    // ── Pagination ──────────────────────────
    const { limit, skip } = getPagination(req.query);

    // ── Filters ─────────────────────────────
    const searchQuery = buildSearchQuery(req.query.search, ["fullName", "email", "phone"]);
    const dateQuery   = buildDateQuery(req.query.fromDate, req.query.toDate);

    const query = { ...searchQuery, ...dateQuery };

    // ── Sort ────────────────────────────────
    const { sortField, sortOrder, needsCollation } = getSortOptions(
      req.query,
      "createdAt",
      ["fullName", "email", "phone"]   // fields that need locale-aware collation
    );

    // ── Query ───────────────────────────────
    const queryBuilder = Staff.find(query)
      .select("-password")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    if (needsCollation) {
      queryBuilder.collation({ locale: "en", strength: 2 });
    }

    const staffs = await queryBuilder;
    const total  = await Staff.countDocuments(query);

    res.json({ staffs, total });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ONE

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
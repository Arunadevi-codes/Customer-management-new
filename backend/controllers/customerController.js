const fs   = require("fs");
const path = require("path");

const Customer = require("../models/Customer");

const {
  buildSearchQuery,
  buildDateQuery,
  getPagination,
  getSortOptions,
} = require("../helpers/queryHelper");

//  CREATE

exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, street, state, city, pincode } = req.body;

    const customer = new Customer({
      name,
      email,
      phone,
      street,
      state,
      city,
      pincode,
      image: req.file ? req.file.filename : null,
    });

    const saved = await customer.save();
    res.json(saved);

  } catch (err) {
    res.status(500).json(err);
  }
};

// ─────────────────────────────────────────────
//  GET ALL  (with search / date filter / sort / pagination)
// ─────────────────────────────────────────────

exports.getCustomers = async (req, res) => {
  try {
    // ── Pagination ──────────────────────────
    const { limit, skip } = getPagination(req.query);

    // ── Filters ─────────────────────────────
    const searchQuery = buildSearchQuery(req.query.search, ["name", "email", "phone"]);
    const dateQuery   = buildDateQuery(req.query.fromDate, req.query.toDate);

    const query = { ...searchQuery, ...dateQuery };

    // ── Sort ────────────────────────────────
    const { sortField, sortOrder } = getSortOptions(
      req.query,
      "createdAt",
      ["name", "email", "phone"]   // fields that need locale-aware collation
    );

    // ── Query ───────────────────────────────
    const customers = await Customer.find(query)
      .sort({ [sortField]: sortOrder })
      .collation({ locale: "en", strength: 2 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(query);

    res.json({ customers, total });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//  GET ONE

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer", error: err.message });
  }
};

//  UPDATE

exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, street, state, city, pincode } = req.body;

    const updateData = { name, email, phone, street, state, city, pincode };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json(err);
  }
};

//  DELETE
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Remove associated image from disk
    if (customer.image) {
      const imagePath = path.join(__dirname, "..", "uploads", customer.image);

      fs.unlink(imagePath, (err) => {
        if (err) console.log("Error deleting image:", err.message);
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting customer", error: err.message });
  }
};
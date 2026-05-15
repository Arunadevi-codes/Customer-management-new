const fs   = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const Customer = require("../models/Customer");
const Staff    = require("../models/Staff");

const {
  buildSearchQuery,
  buildDateQuery,
  getPagination,
  getSortOptions,
} = require("../helpers/queryHelper");

// ── CREATE ─────────────────────────────────────────────────────
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, street, state, city, pincode, assignedTo } = req.body;

    const customer = new Customer({
      name, email, phone, street, state, city, pincode,
      image:      req.file ? req.file.filename : null,
      assignedTo: assignedTo || null,
    });

    const saved = await customer.save();
    await saved.populate("assignedTo", "fullName employeeId");
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ── GET ALL ────────────────────────────────────────────────────
exports.getCustomers = async (req, res) => {
  try {
    const { limit, skip } = getPagination(req.query);

    const searchQuery = buildSearchQuery(req.query.search, ["name", "email", "phone"]);
    const dateQuery   = buildDateQuery(req.query.fromDate, req.query.toDate);

    let query = { ...searchQuery, ...dateQuery };

    // ✅ Staff role — only show their assigned customers
    // Cast req.user.id to ObjectId explicitly to ensure Mongoose matches correctly
    if (req.user.role !== "superadmin") {
      try {
        query.assignedTo = new mongoose.Types.ObjectId(req.user.id);
      } catch {
        // If id is somehow malformed, return empty result safely
        return res.json({ customers: [], total: 0 });
      }
    }

    const { sortField, sortOrder } = getSortOptions(req.query, null, ["name", "email", "phone"]);
    const appliedSortField = sortField || "createdAt";
    const appliedSortOrder = sortField ? sortOrder : -1;

    const customers = await Customer.find(query)
      .populate("assignedTo", "fullName employeeId")
      .sort({ [appliedSortField]: appliedSortOrder })
      .collation({ locale: "en", strength: 2 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(query);

    res.json({ customers, total });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ── GET ONE ────────────────────────────────────────────────────
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("assignedTo", "fullName employeeId");

    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer", error: err.message });
  }
};

// ── UPDATE ─────────────────────────────────────────────────────
exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, street, state, city, pincode, removeImage, assignedTo } = req.body;

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const updateData = {
      name, email, phone, street, state, city, pincode,
      assignedTo: assignedTo === "" || assignedTo === "null" ? null : assignedTo || customer.assignedTo,
    };

    // Remove image
    if (removeImage === "true" && customer.image) {
      const imagePath = path.join(__dirname, "..", "uploads", customer.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      updateData.image = null;
    }

    // New image upload
    if (req.file) {
      if (customer.image) {
        const oldPath = path.join(__dirname, "..", "uploads", customer.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = req.file.filename;
    }

    const updated = await Customer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate("assignedTo", "fullName employeeId");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update customer", error: err.message });
  }
};

// ── DELETE ─────────────────────────────────────────────────────
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

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
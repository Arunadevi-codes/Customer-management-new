const Customer = require("../models/Customer");
const fs = require("fs");
const path = require("path");

// ✅ CREATE customer
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, street, state, city, pincode } = req.body;

    const image = req.file ? req.file.filename : null;

    const customer = new Customer({
      name,
      email,
      phone,
      street,
      state,
      city,
      pincode,
      image
    });

    const saved = await customer.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ✅ GET all customers
exports.getCustomers = async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const { fromDate, toDate } = req.query;

    const query = {};

    // 🔍 Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    // 📅 Date filter
    if (fromDate || toDate) {
      query.createdAt = {};

      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = offset * limit;
    const sortField = req.query.sortField || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

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

// ✅ GET single customer
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    // .populate("state", "name")
    // .populate("city", "name");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer", error: err.message });
  }
};

// ✅ UPDATE customer
exports.updateCustomer = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      street: req.body.street,
      state: req.body.state,
      city: req.body.city,
      pincode: req.body.pincode 
    };

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

// ✅ DELETE customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (customer.image) {
      const imagePath = path.join(__dirname, "..", "uploads", customer.image);

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log("Error deleting image:", err.message);
        }
      });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting customer", error: err.message });
  }
};
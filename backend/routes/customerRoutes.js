const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const verifyToken = require("../middleware/authMiddleware"); 

// CREATE customer
router.post("/", verifyToken, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const saved = await customer.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET all customers with pagination, search, and sorting
router.get("/", verifyToken, async (req, res) => {
  try {
    // ✅ Parse as numbers properly
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const { fromDate, toDate } = req.query;

    const query = {};

// 🔍 Search filter
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

    // ✅ Correct skip calculation (offset is already page-1)
    const skip = offset * limit;

    const customers = await Customer.find(query)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Customer.countDocuments(query);

    res.json({
      customers,
      total
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single customer with error handling
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch customer", error: err.message });
  }
});

// UPDATE customer
router.put("/:id", verifyToken, async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// DELETE customer
router.delete("/:id",verifyToken, async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});

module.exports = router;
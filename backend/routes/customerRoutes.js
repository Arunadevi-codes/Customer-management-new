const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

// ✅ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Routes
router.post("/", verifyToken, upload.single("image"), createCustomer);
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.put("/:id", verifyToken, upload.single("image"), updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

module.exports = router;
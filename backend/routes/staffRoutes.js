const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getNextEmployeeId, getStaff, getStaffById } = require("../controllers/staffReadController");
const { createStaff, updateStaff, deleteStaff } = require("../controllers/staffWriteController");
const upload = require("../middleware/upload");

// All three image fields handled in one middleware
const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "aadharImage",  maxCount: 1 },
  { name: "panImage",     maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }

    if (err instanceof Error) {
      return res.status(400).json({ message: err.message });
    }

    next(err);
  });
};

router.get("/next-employee-id", getNextEmployeeId);
router.get("/", getStaff);
router.get("/:id", getStaffById);
router.post("/",   handleUpload, createStaff);
router.put("/:id", handleUpload, updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;
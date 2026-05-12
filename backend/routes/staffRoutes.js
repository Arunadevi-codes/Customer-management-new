const express = require("express");
const router = express.Router();
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const { getNextEmployeeId, getStaff, getStaffById } = require("../controllers/staffReadController");
const { createStaff, updateStaff, deleteStaff } = require("../controllers/staffWriteController");
const { getMyProfile, updateMyProfile, changeMyPassword } = require("../controllers/profileController");

const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "aadharImage",  maxCount: 1 },
  { name: "panImage",     maxCount: 1 },
]);

const handleUpload = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    if (err instanceof Error)
      return res.status(400).json({ message: err.message });
    next(err);
  });
};

// ── Profile routes — MUST be before /:id wildcard ─────────────
router.get("/profile/me", verifyToken, getMyProfile);
router.put("/profile/me", verifyToken, handleUpload, updateMyProfile);
router.put("/profile/change-password", verifyToken, changeMyPassword);

// ── Standard CRUD ──────────────────────────────────────────────
router.get("/next-employee-id", getNextEmployeeId);
router.get("/", getStaff);
router.get("/:id", getStaffById);
router.post("/", handleUpload, createStaff);
router.put("/:id", handleUpload, updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;
const express = require("express");
const router = express.Router();
const { getNextEmployeeId, getStaff, getStaffById } = require("../controllers/staffReadController");
const { createStaff, updateStaff, deleteStaff } = require("../controllers/staffWriteController");
const upload = require("../middleware/upload");

// All three image fields handled in one middleware
const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "aadharImage",  maxCount: 1 },
  { name: "panImage",     maxCount: 1 },
]);

router.get("/next-employee-id", getNextEmployeeId);
router.get("/", getStaff);
router.get("/:id", getStaffById);
router.post("/",    uploadFields, createStaff);
router.put("/:id",  uploadFields, updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;
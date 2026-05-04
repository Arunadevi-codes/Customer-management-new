const express = require("express");
const router = express.Router();
const { getNextEmployeeId, getStaff, getStaffById } = require("../controllers/staffReadController");
const { createStaff, updateStaff, deleteStaff } = require("../controllers/staffWriteController");
const upload = require("../middleware/upload");

router.get("/next-employee-id", getNextEmployeeId);
router.get("/", getStaff);
router.get("/:id", getStaffById);
router.post("/", upload.single("profileImage"), createStaff);
router.put("/:id", upload.single("profileImage"), updateStaff);
router.delete("/:id", deleteStaff);

module.exports = router;
const express = require("express");
const router = express.Router();

const { getCitiesByState, getAllStates } = require("../controllers/locationController");

router.get("/states", getAllStates);
router.get("/cities", getCitiesByState);

module.exports = router;
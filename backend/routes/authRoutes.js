const express = require("express");
const router  = express.Router();

const { adminLogin, staffLogin } = require("../controllers/authController");

router.post("/login",       adminLogin);  
router.post("/staff-login", staffLogin);  

module.exports = router;
const express = require("express");
//const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const { createVendor, login } = require("../controllers/dispatchercCrl");

const auth = require("../middleware/authMiddleware");

router.post("/register", createVendor);
router.post("/login", login);

module.exports = router;

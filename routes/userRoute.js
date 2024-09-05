const express = require("express");
//const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const {
  createUser,
  login,
  createOrder
} = require("../controllers/userCtrl");

const auth = require("../middleware/userauthMiddleware");

router.post("/register", createUser);
router.post("/login", login);
router.post("/create_order", auth, createOrder)



module.exports = router;

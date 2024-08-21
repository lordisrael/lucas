const express = require("express");
//const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const { createAdmin, login, acceptVendor, suspendVendor, ListPendingVendor, ListActiveVendor, ListAllVendor, acceptDispatcher, suspendDispatcher, ListPendingDispatcher, ListActiveDispatcher, ListAllDispatcher } = require("../controllers/adminCtrl");

const auth = require("../middleware/authMiddleware");

router.post("/register", createAdmin);
router.post("/login", login);
router.patch("/approve-vendor/:vendorId",auth, acceptVendor)
router.patch("/approve-dispatcher/:dispatcherId", auth, acceptDispatcher)
router.patch("/suspend-vendor/:vendorId", auth, suspendVendor)
router.patch("/suspend-dispatcher/:dispatcherId", auth, suspendDispatcher)
router.get("/pending-vendors", auth, ListPendingVendor)
router.get("/pending-dispatchers", auth, ListPendingDispatcher)
router.get("/active-vendors", auth, ListActiveVendor)
router.get("/active-dispatchers", auth, ListActiveDispatcher)
router.get("/all-vendors", auth, ListAllVendor)
router.get("/all-dispatchers", auth, ListAllDispatcher)

module.exports = router;

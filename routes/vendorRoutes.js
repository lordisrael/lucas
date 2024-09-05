const express = require("express");
//const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const { createVendor, login } = require("../controllers/vendorCtrl");
const {createProduct, listAllProducts} = require("../controllers/productCtrl")
const {listAllOrdersForVendor} = require("../controllers/orderCtrl")

const vendorauth = require("../middleware/vendorauthMiddleware")

router.post("/register", createVendor);
router.post("/login", login)
router.post("/create_product", vendorauth, createProduct)
router.get("/all_products", vendorauth, listAllProducts)
router.get("/list_all_orders", vendorauth, listAllOrdersForVendor)


module.exports = router;

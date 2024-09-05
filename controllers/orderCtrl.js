const Order = require("../models/order");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");

const listAllOrdersForVendor = asyncHandler(async (req, res) => {
  const vendorId = req.user._id; // Assumes auth middleware attaches the vendor ID to req.user

  try {
    // Step 1: Find all products associated with the vendor
    const vendorProducts = await Product.find({ vendor: vendorId });

    if (vendorProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this vendor",
      });
    }

    // Extract product IDs
    const productIds = vendorProducts.map((product) => product._id);

    // Step 2: Find all orders that include these products
    const orders = await Order.find({
      "products.product": { $in: productIds },
    })
      .populate({
        path: "products.product",
        select: "product_name product_price", // Adjust as needed
      })
      .populate("dispatcher", "full_name email"); // Populate dispatcher details

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
});


module.exports = {
  listAllOrdersForVendor,
};

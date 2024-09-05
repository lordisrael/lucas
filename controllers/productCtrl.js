const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");


const createProduct = asyncHandler(async(req, res) => {
    try {
      const {
        product_name, product_description, category, product_quantity,product_price, variants,
      } = req.body;

      // Create a new product using the vendor from the auth middleware
      const newProduct = new Product({
        product_name,
        product_description,
        category,
        product_quantity,
        product_price,
        variants,
        vendor: req.user._id, // Set the vendor from the authenticated user
      });

      await newProduct.save();

      res.status(StatusCodes.CREATED).json({
        status: "Success",
        data: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Product creation failed",
        error: error.message,
      });
    }
    // const product = await Product.create(req.body);
    // res
    //   .status(StatusCodes.CREATED)
    //   .json({ status: "Success", data: product });
}) 

const deleteProduct = asyncHandler(async(req, res) => {

})

const listAllProducts = async (req, res) => {
  try {
    // Get the vendor ID from req.user
    const vendorId = req.user._id;
    // Fetch products that belong to the authenticated vendor
    const products = await Product.find({ vendor: vendorId });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
      error: error.message,
    });
  }
};

module.exports = {
    createProduct,
    listAllProducts
}
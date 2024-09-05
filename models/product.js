const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Function to generate product ID
const generateProductId = () => {
  const randomNumber = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");
  return `9jr_prodId_${randomNumber}`;
};

// Function to generate a random alphanumeric string of length 4
const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
};

const variantSchema = new mongoose.Schema({
  variant_image: {
    type: String,
    required: true,
  },
  variant_name: {
    type: String,
    required: true,
  },
  variant_price: {
    type: Number,
    required: true,
  },
  variant_quantity: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_description: {
    type: String,
    maxlength: 350,
  },
  category: {
    type: String,
    enum: ["computers", "furniture", "electronics"],
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
  },
  quantity_sold: {
    type: Number,
    default:0
  },
  product_price: {
    type: Number,
    required: true,
  },
  product_id: {
    type: String,
    default: generateProductId,
    unique: true,
  },
  sku: {
    type: String,
    unique: true,
  },
  variants: [variantSchema],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor", // Reference to Vendor model
    required: true,
  },
});


// Pre-save middleware to generate SKU
productSchema.pre('save', function (next) {
  if (!this.sku) {
    const categoryPart = this.category.substring(0, 3).toUpperCase();
    const namePart = this.product_name.substring(0, 4).toUpperCase();
    const randomPart = generateRandomString();
    this.sku = `${categoryPart}${namePart}${randomPart}`;
  }
  next();
});
// Export the model
module.exports = mongoose.model("Product", productSchema);

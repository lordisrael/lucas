const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const vendorSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    ],
    unique: true,
  },
  institute: {
    type: String,
    required: true,
    enum: ["FUTA", "UI", "OAU", "LASU", "UNILAG"], //
  },
  store_logo: {
    type: String, // URL or path to the logo image
  },
  store_name: {
    type: String,
    required: true,
  },
  nin: {
    type: Number,
    required: true,
    unique: true,
  },
  profile_picture: {
    type: String, // URL or path to the profile picture
  },
  status: {
    type: String,
    enum: ["pending", "active", "suspended"],
    default: "pending",
  },
  password: {
    type: String,
    required: true,
    trim: true, // Automatically trim leading and trailing spaces
  },
  total_sales: {
    type: Number,
    default: 0, // Default to 0 if not provided
  },
  completed_sales: {
    type: Number,
    default: 0, // Default to 0 if not provided
  },
  pending_sales: {
    type: Number,
    default: 0, // Default to 0 if not provided
  },
});
vendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
vendorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
module.exports = mongoose.model("Vendor", vendorSchema);

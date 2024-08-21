const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const dispatcherSchema = new mongoose.Schema({
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
});

dispatcherSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
dispatcherSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
module.exports = mongoose.model("Dispatcher", dispatcherSchema);

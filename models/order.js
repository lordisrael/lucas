const mongoose = require("mongoose");

// Function to generate trackId
const generateTrackId = () => {
  const randomNumber = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `9jr_trackId_${randomNumber}`;
};

const orderSchema = new mongoose.Schema(
  {
    trackId: {
      type: String,
      default: generateTrackId,
      unique: true,
    },
    dispatcher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dispatcher", // Reference to Dispatcher model
      //required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product model
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
  }
);

// Export the model
module.exports = mongoose.model("Order", orderSchema);

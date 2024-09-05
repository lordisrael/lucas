//require('cookie-parser')
const User = require("../models/student");
const Product = require("../models/product")
const Order = require("../models/order")
const asyncHandler = require("express-async-handler");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const { createJWT } = require("../config/jwt");
const { createRefreshJWT } = require("../config/createRefreshJwt");
const { StatusCodes } = require("http-status-codes");


const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userAlreadyExist = await User.findOne({ email });
  if (!userAlreadyExist) {
    const user = await User.create(req.body);
    const token = createJWT(user._id, user.firstname);
    res.status(StatusCodes.CREATED).json({ status: "Success", data: user, token: token});
  } else {
    throw new BadRequestError("Email already exist");
  }
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    const refreshToken = await createRefreshJWT(user._id);
    /* const updateUser =*/ await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // _   id:user._id,
    //     firstname: user.firstname,
    //     secondname: user.secondname,
    //     email: user.email,
    //     mobile: user.email,
    //     token: createJWT(user._id, user.firstname)
    // res.status(StatusCodes.OK).json({
    //   _id: user._id,
    //   firstname: user.firstname,
    //   secondname: user.secondname,
    //   email: user.email,
    //   mobile: user.mobile,
    //   token: createJWT(user._id, user.firstname),
    // });
    res.status(StatusCodes.OK).json({
      status: "Success",
      token: createJWT(user._id, user.full_name),
    });
  } else {
    throw new UnauthenticatedError("Invalid credentials");
  }
})

const createOrder = asyncHandler(async (req, res) => {
  const { products, dispatcherId, status } = req.body;

  // Validate input
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      status: "Failure",
      message: "Products are required",
    });
  }

  // if (dispatcherId && !mongoose.Types.ObjectId.isValid(dispatcherId)) {
  //   return res.status(400).json({
  //     status: "Failure",
  //     message: "Invalid dispatcher ID",
  //   });
  // }

  try {
    // Check if all products exist
    const productIds = products.map(p => p.product);
    const fetchedProducts = await Product.find({ _id: { $in: productIds } });
    if (fetchedProducts.length !== productIds.length) {
      return res.status(404).json({
        status: "Failure",
        message: "One or more products not found",
      });
    }

    // Create new order
    const newOrder = new Order({
      //dispatcher: dispatcherId || null, // Default to null if not provided
      //status: status || "pending", // Default to "pending" if not provided
      products: products.map(p => ({
        product: p.product,
        quantity: p.quantity,
      })),
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({
      status: "Success",
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Failed to create order",
      error: error.message, // Include error message for debugging
    });
  }
});



module.exports = {
  createUser,
  login,
  createOrder
}

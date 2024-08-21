const Dispatcher = require("../models/dispatcher");
const asyncHandler = require("express-async-handler");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const { createJWT } = require("../config/jwt");
const { createRefreshJWT } = require("../config/createRefreshJwt");
const { StatusCodes } = require("http-status-codes");

const createVendor = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userAlreadyExist = await Dispatcher.findOne({ email });
  if (!userAlreadyExist) {
    const user = await Dispatcher.create(req.body);
    //const token = createJWT(user._id);
    res
      .status(StatusCodes.CREATED)
      .json({ status: "Success", message: "Wait for approval" });
  } else {
    throw new BadRequestError("Email already exist");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await Dispatcher.findOne({ email });

  // Check if the user exists and the password is correct
  if (user && (await user.comparePassword(password))) {
    // Check the user's status
    if (user.status === "pending") {
      throw new UnauthenticatedError(
        "Your account is still pending. Please check your email for approval."
      );
    } else if (user.status === "suspended") {
      throw new UnauthenticatedError(
        "Your account is suspended. Please contact support for further assistance."
      );
    } else if (user.status === "active") {
      // If the status is active, proceed with login
      const refreshToken = await createRefreshJWT(user._id);
      await Dispatcher.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

      // Set the refresh token as a cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 72 hours
      });

      // Return the JWT token
      res.status(StatusCodes.OK).json({
        status: "Success",
        token: createJWT(user._id, user.full_name),
      });
    } else {
      // If the status is something unexpected
      throw new UnauthenticatedError(
        "Unable to log in. Please contact support."
      );
    }
  } else {
    throw new UnauthenticatedError("Invalid credentials");
  }
});

module.exports = {
  createVendor,
  login,
};

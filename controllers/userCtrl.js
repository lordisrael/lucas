//require('cookie-parser')
const User = require("../models/student");
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
});


module.exports = {
  createUser,
  login
}

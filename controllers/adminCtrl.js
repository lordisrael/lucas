//require('cookie-parser')
const Admin = require("../models/admin")
const Vendor = require("../models/vendor")
const Dispatcher = require("../models/dispatcher")
const asyncHandler = require("express-async-handler");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const { createJWT } = require("../config/jwt");
const { createRefreshJWT } = require("../config/createRefreshJwt");
const { StatusCodes } = require("http-status-codes");
const sendEmail = require("../config/sendEmail");

const createAdmin = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userAlreadyExist = await Admin.findOne({ email });
  if (!userAlreadyExist) {
    const user = await Admin.create(req.body);
    const token = createJWT(user._id);
    res
      .status(StatusCodes.CREATED)
      .json({ status: "Success", data: user, token: token });
  } else {
    throw new BadRequestError("Email already exist");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Trim any trailing spaces from the password
  const trimmedPassword = password.trim();

  const user = await Admin.findOne({ email });
  if (user && (await user.comparePassword(trimmedPassword))) {
    const refreshToken = await createRefreshJWT(user._id);
    await Admin.findByIdAndUpdate(
      user._id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      status: "Success",
      token: createJWT(user._id),
    });
  } else {
    throw new UnauthenticatedError("Invalid credentials");
  }
});

const acceptVendor = asyncHandler(async(req, res) => {
   const vendorId = req.params.vendorId; // Assuming vendorId is passed as a route parameter

   // Fetch vendor from the database using vendorId
   const vendor = await Vendor.findById(vendorId);

   if (!vendor) {
     res.status(404);
     throw new Error("Vendor not found");
   }

   // Check if vendor is already active
   if (vendor.status === "active") {
     res.status(400);
     throw new Error("Vendor is already active");
   }

   // Update the vendor's status to 'active'
   vendor.status = "active";
   await vendor.save();

   // Send email
   try {
     await sendEmail(
      {
     email: vendor.email, // Derive email from the fetched vendor
     subject: "Your Vendor Registration has been Accepted",
     message: `Hello ${vendor.full_name},\n\nYour vendor registration has been accepted. You are now an active vendor on our platform.\n\nBest regards,\nThe Company `, // Customize this as needed
      });
     res
       .status(200)
       .json({ message: "Vendor accepted and email sent successfully" });
   } catch (error) {
     res.status(500);
     throw new Error("Vendor status updated, but email sending failed");
   }
  
})

const suspendVendor = asyncHandler(async(req, res) => {
  const vendorId = req.params.vendorId;

  // Find the vendor by ID
  const vendor = await Vendor.findById(vendorId);

  // Check if the vendor exists
  if (!vendor) {
    res.status(404);
    throw new Error("Vendor not found");
  }

  // Check if the vendor is already suspended
  if (vendor.status === "suspended") {
    res.status(400);
    throw new Error("Vendor is already suspended");
  }

  // Update the status to 'suspended'
  vendor.status = "suspended";
  await vendor.save();

  res.status(200).json({ message: "Vendor suspended successfully", vendor });
})

const ListPendingVendor = asyncHandler(async(req, res) => {
  const pendingVendors = await Vendor.find({ status: "pending" });

  if (!pendingVendors || pendingVendors.length === 0) {
    res.status(200).json({
     status: "Success",
     data: pendingVendors})
    
  }

  res.status(200).json({
     status: "Success",
     data: pendingVendors
   })

})
const ListActiveVendor = asyncHandler(async (req, res) => {
  const activeVendors = await Vendor.find({ status: "active" });

  if (!activeVendors || activeVendors.length === 0) {
    res.status(404);
    throw new Error("No active vendors found");
  }

  res.status(200).json({
     status: "Success",
     data: activeVendors
   });

});
const ListAllVendor = asyncHandler(async (req, res) => {
   const allVendors = await Vendor.find();

   if (!allVendors || allVendors.length === 0) {
     res.status(404);
     throw new Error("No vendors found");
   }
   res.status(StatusCodes.OK).json({
     status: "Success",
     data: allVendors
   });
});

const acceptDispatcher = asyncHandler(async (req, res) => {
  const dispatcherId = req.params.dispatcherId; // Assuming vendorId is passed as a route parameter

  // Fetch vendor from the database using vendorId
  const dispatcher = await Dispatcher.findById(dispatcherId);

  if (!dispatcher) {
    res.status(404);
    throw new Error("Dispatcher not found");
  }

  // Check if vendor is already active
  if (dispatcher.status === "active") {
    res.status(400);
    throw new Error("Dispatcher is already active");
  }

  // Update the vendor's status to 'active'
  dispatcher.status = "active";
  await dispatcher.save();

  // Send email
  try {
    await sendEmail({
      email: dispatcher.email, // Derive email from the fetched vendor
      subject: "Your Dispatcher Registration has been Accepted",
      message: `Hello ${dispatcher.full_name},\n\nYour dispatcher registration has been accepted. You are now an active dispatcher on our platform.\n\nBest regards,\nThe Company `, // Customize this as needed
    });
    res
      .status(200)
      .json({ message: "Vendor accepted and email sent successfully" });
  } catch (error) {
    res.status(500);
    throw new Error("Vendor status updated, but email sending failed");
  }
});

const suspendDispatcher = asyncHandler(async (req, res) => {
  const dispatcherId = req.params.dispatcherId;

  // Find the vendor by ID
  const dispatcher = await Dispatcher.findById(dispatcherId);

  // Check if the vendor exists
  if (!dispatcher) {
    res.status(404);
    throw new Error("Dispatcher not found");
  }

  // Check if the vendor is already suspended
  if (dispatcher.status === "suspended") {
    res.status(400);
    throw new Error("Dispatcher is already suspended");
  }

  // Update the status to 'suspended'
  dispatcher.status = "suspended";
  await dispatcher.save();

  res.status(200).json({ message: "Dispatcher suspended successfully", dispatcher });
});

const ListPendingDispatcher = asyncHandler(async (req, res) => {
  const pendingDispatchers = await Dispatcher.find({ status: "pending" });

  if (!pendingDispatchers || pendingDispatchers.length === 0) {
    res.status(200).json({
      status: "Success",
      data: pendingDispatchers,
    });
  }

  res.status(200).json({
    status: "Success",
    data: pendingDispatchers,
  });
});
const ListActiveDispatcher = asyncHandler(async (req, res) => {
  const activeDispatcher = await Dispatcher.find({ status: "active" });

  // if (!activeVendors || activeVendors.length === 0) {
  //   res.status(404);
  //   throw new Error("No active vendors found");
  // }

  res.status(200).json({
    status: "Success",
    data: activeDispatcher,
  });
});
const ListAllDispatcher = asyncHandler(async (req, res) => {
  const allDispatchers = await Dispatcher.find();

  // if (!allDispatchers || allDispatchers.length === 0) {
  //   res.status(404);
  //   throw new Error("No vendors found");
  // }
  res.status(StatusCodes.OK).json({
    status: "Success",
    data: allDispatchers,
  });
});

const assigndispatcherToOrder = asyncHandler(async(req, res) => {

})

module.exports = {
  createAdmin,
  ListAllDispatcher,
  ListActiveDispatcher,
  acceptVendor,
  acceptDispatcher,
  login,
  suspendDispatcher,
  ListActiveVendor,
  ListAllVendor,
  ListPendingVendor,
  ListPendingDispatcher,
  suspendVendor
};

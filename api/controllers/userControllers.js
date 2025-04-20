// Import Section
import User from "../data_models/userModels.js";
import crypto from "crypto";
import catchAsyncError from "../middleware/catchAsyncError.js";
import { createToken } from "../middleware/jsonWebToken.js";
import {
  decryptPassword,
  encryptPassword,
} from "../middleware/passwordMiddleware.js";
import SendEmail from "../middleware/sendEmail.js";
import responseHandler from "../utils/responseHandler.js";
import { forgotPasswordTemplate } from "../utils/emailTemplates.js";
import validateId from "../middleware/mongoDbIdValidate.js";

// User Authentication
const registerUser = catchAsyncError(async (req, res) => {
  const { name, email, password, role = "user", address } = req.body;

  if (!name || !email || !password) {
    return responseHandler(res, 400, "Name, email, and password are required");
  }

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    return responseHandler(res, 409, "User already exists with this email");
  }

  const hashedPassword = await encryptPassword(password);
  const newUser = new User({
    originalPass: password,
    name,
    email,
    password: hashedPassword,
    role,
    address,
  });

  await newUser.save();
  const userObj = newUser.toObject();
  delete userObj.password;

  const token = createToken(userObj._id, userObj.role, userObj.email);
  return responseHandler(res, 201, "User registered successfully", {
    token,
    user: userObj,
  });
});

const logIn = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return responseHandler(res, 400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("-resetPasswordToken -resetPasswordTokenExpire");
  if (!user || !(await decryptPassword(password, user.password))) {
    return responseHandler(res, 401, "Invalid email or password");
  }

  const token = createToken(user._id, user.role, user.email);
  const userResponse = user.toObject();
  delete userResponse.password;

  return responseHandler(res, 200, "Login successful", { user: userResponse, token });
});

const logoutUser = catchAsyncError(async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
    });
    return responseHandler(res, 200, "Logout successful");
  } catch (error) {
    return next(error);
  }
});

// Password Management
const updatePassword = catchAsyncError(async (req, res) => {
  const { email, password, newPassword } = req.body;

  if (!email || !password || !newPassword) {
    return responseHandler(res, 400, "All fields are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return responseHandler(res, 404, "User not found");
  }

  const isPasswordMatched = await decryptPassword(password, user.password);
  if (!isPasswordMatched) {
    return responseHandler(res, 401, "Old password is incorrect");
  }

  if (newPassword.length < 6) {
    return responseHandler(res, 400, "New password must be at least 6 characters long");
  }

  user.password = await encryptPassword(newPassword);
  await user.save();
  const token = createToken(user._id, user.role, user.email);

  return responseHandler(res, 200, "Password updated successfully", {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const forgotPassword = catchAsyncError(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return responseHandler(res, 404, "User not found");

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = forgotPasswordTemplate(user.name, resetPasswordUrl);

  try {
    await SendEmail({
      email: user.email,
      subject: "SmartBuy Password Recovery",
      message,
      isHtml: true,
    });
    return responseHandler(
      res,
      200,
      `Email sent to ${user.email} successfully`
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return responseHandler(
      res,
      500,
      "Email could not be sent. Please try again later."
    );
  }
});

const resetPassword = catchAsyncError(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpire: { $gt: Date.now() },
  });

  if (!user) return responseHandler(res, 400, "Invalid token or token expired");

  if (!req.body.password || req.body.password.length < 6) {
    return responseHandler(
      res,
      400,
      "Password must be at least 6 characters long"
    );
  }

  user.password = await encryptPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();

  const token = createToken(user._id, user.role, user.email);
  return responseHandler(res, 200, "Password reset successfully", {
    token,
    user,
  });
});

// User Information
const getUserDetails = catchAsyncError(async (req, res) => {
  validateId(req.user?.id);
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return responseHandler(res, 404, "User not found");

  return responseHandler(res, 200, "User found", { user });
});

const getUserById = catchAsyncError(async (req, res) => {
  const { id } = req.query;
  validateId(id);

  const user = await User.findById(id).select(
    "-password -resetPasswordToken -resetPasswordTokenExpire"
  );
  if (!user) return responseHandler(res, 404, "User not found");

  return responseHandler(res, 200, "User details fetched successfully", {
    user,
  });
});

// Admin Management
const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await User.find().select("-password");
  if (!users || users.length === 0) {
    return responseHandler(res, 404, "No users found");
  }
  return responseHandler(res, 200, "Users fetched successfully", { users });
});

export {
  registerUser,
  logIn,
  logoutUser,
  updatePassword,
  forgotPassword,
  resetPassword,
  getUserDetails,
  getUserById,
  getAllUsers,
};

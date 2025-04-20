// models/User.js
import mongoose from "mongoose";
import crypto from "crypto";
import { type } from "os";
// import bcrypt from "bcryptjs"; // Uncomment if you're hashing passwords here

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name must be less than 50 characters"],
    },
    originalPass:{
      type: String,
      trim: true,
      // minlength: [6, "Password must be at least 6 characters"],
      // maxlength: [20, "Password must be less than 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // select: false, 
    },
    role: {
      type: String,
      enum: ["admin", "user", "seller"],
      default: "user",
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpire: {
      type: Date,
      default: null,
    },
    address: {
      street: { type: String, default: "", trim: true },
      city: { type: String, default: "", trim: true },
      state: { type: String, default: "", trim: true },
      zip: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);

// Optional: Pre-save hook for hashing password
/*
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
*/

// Instance method for generating password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
};

export default mongoose.model("User", userSchema);

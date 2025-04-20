// All Imports
import express from "express";
import {
  registerUser,
  logIn,
  forgotPassword,
  resetPassword,
  getUserDetails,
  getUserById,
  logoutUser,
  getAllUsers,
  updatePassword
} from "../controllers/userControllers.js";
import { verifyRole, verifyToken } from "../middleware/jsonWebToken.js";

// Create Router
const router = express.Router();

// 🟢 Public Routes
router.post("/register", registerUser);
router.post("/login", logIn);
router.post("/forgot-password", forgotPassword);
router.post("/updatePassword", updatePassword);
router.put("/password/reset/:resetToken", resetPassword);
router.post("/logout", logoutUser);

// 🔒 Protected Routes (Requires Authentication)
router.get("/profile", verifyToken, getUserDetails);

// 🔐 Admin Routes (Requires Admin Role)
router.get("/:id", verifyToken, verifyRole("admin"), getUserById);
router.get("/admin/allUsers", verifyToken, verifyRole("admin"), getAllUsers);

export default router;

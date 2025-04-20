// 🔹 Import Dependencies
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import responseHandler from "../utils/responseHandler.js";

// 🔹 Load Environment Variables
dotenv.config();

// 🔹 JWT Configuration
const config = {
  secret: process.env.JWT_SECRET_KEY,
  expiration: "7d",
};

// 🔹 Ensure Secret Key Exists
if (!config.secret) {
  throw new Error(
    "JWT_SECRET_KEY is missing. Please set it in environment variables."
  );
}

// 🔹 Create JWT Token
const createToken = (userId, role, email) => {
  if (!userId || !role || !email) {
    throw new Error("User ID, role, and email are required to generate a token.");
  }

  return jwt.sign({ id: userId, role, email }, config.secret, {
    expiresIn: config.expiration,
  });
};

// 🔹 Verify JWT Token Middleware
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return responseHandler(
        res,
        401,
        "Authorization token is missing or invalid."
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.secret);

    if (!decoded?.id || !decoded?.role) {
      return responseHandler(res, 403, "Invalid token payload.");
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);

    const errorMessage =
      error.name === "TokenExpiredError"
        ? "Token has expired. Please log in again."
        : "Invalid token.";
    return responseHandler(res, 401, errorMessage);
  }
};

// 🔹 Role-Based Authorization Middleware
const verifyRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return responseHandler(res, 403, "Access denied. Insufficient permissions.");
  }
  next();
};

// 🔹 Export Utilities
export { createToken, verifyToken, verifyRole };

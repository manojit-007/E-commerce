import responseHandler from "../utils/responseHandler.js";

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";
  }
}

const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.log("Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // Default values
  const statusCode = err.statusCode || res.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Categorize errors
  if (err.name === "TokenExpiredError") {
    // return res.status(401).json({ error: "Token has expired. Please log in again." });
    return responseHandler(res,401,"Token has expired. Please log in again.")
    // return responseHandler(res, 404, "Product not found.");

  }

  if (err.name === "JsonWebTokenError") {
    return res.status(403).json({ error: "Invalid token." });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Handle unexpected errors
  return res.status(statusCode).json({ error: message });
};

export { CustomError, errorHandler };

import fs from "fs";
import path from "path";
import cloudinary from "../utils/cloudinarySetUp.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import responseHandler from "../utils/responseHandler.js";

// Upload Image Handler
const uploadImage = catchAsyncError(async (req, res, next) => {
  if (!req.file) {
    return responseHandler(res, 400, "No file uploaded.");
  }

  try {
    const inputPath = req.file.path;

    // Upload the original file to Cloudinary
    const uploaderResult = await cloudinary.uploader.upload(inputPath, {
      folder: "hacker_earth_project",
    });

    // Cleanup the temporary file
    fs.unlink(inputPath, (err) => {
      if (err) {
        console.error(
          `Error deleting temporary file at ${inputPath}:`,
          err.message
        );
      } else {
        // console.log(`Deleted temporary file at ${inputPath}`);
      }
    });

    // Send response
    responseHandler(res, 200, "Image uploaded successfully.", {
      url: uploaderResult.secure_url,
      public_id: uploaderResult.public_id,
    });
  } catch (err) {
    console.error("Error in uploadImage:", err.message || err);
    responseHandler(res, 500, "Internal server error.", {
      error: err.message || "An unknown error occurred.",
    });
  }
});

// Delete Image Handler
const deleteImage = catchAsyncError(async (req, res, next) => {
  const { public_id } = req.body;
  // console.log("public_id", public_id);

  if (!public_id) {
    return responseHandler(res, 400, "Public ID is required.");
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    // // console.log(result);

    if (result.result !== "ok") {
      return responseHandler(res, 400, "Failed to delete image.");
    }

    responseHandler(res, 200, "Image deleted successfully.");
  } catch (err) {
    console.error("Error in deleteImage:", err.message);
    responseHandler(res, 500, "Internal server error.", {
      error: err.message || "An unknown error occurred.",
    });
  }
});

export { uploadImage, deleteImage };

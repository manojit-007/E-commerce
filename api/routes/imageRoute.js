import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteImage, uploadImage } from "../controllers/imageController.js";

// Resolve __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, "../temp");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const imageRouter = express.Router();

// Routes
imageRouter.post("/upload", upload.single("image"), uploadImage);
imageRouter.delete("/delete", deleteImage);

export default imageRouter;

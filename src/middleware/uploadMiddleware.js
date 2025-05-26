import multer from "multer";
import path from "path";
import { AppError } from "../utils/appError.js";

// Configure storage for temporary files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // e.g., .jpg, .png
    cb(null, `student-${req.params.id}-${Date.now()}${ext}`); // 
  },
});

// File filter to allow only JPEG and PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError("Only JPEG and PNG images are allowed", 400), false);
  }
};

// Multer middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

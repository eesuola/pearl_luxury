import multer from "multer";
import path from "path";
import { AppError } from "../utils/appError.js";
import { v4 as uuidv4 } from "uuid"; 
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// Configure storage for temporary files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
 filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png, etc.
    // Create a unique filename using timestamp + UUID
    const uniqueName = `admin-${Date.now()}-${uuidv4()}${ext}`;
    cb(null, uniqueName);
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

import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

// Multer storage config: memory storage for processing with Sharp
const storage = multer.memoryStorage();

// File type validation and size limits
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  fileFilter,
});

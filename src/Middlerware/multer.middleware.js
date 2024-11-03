/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 01-11-2024
 * Description: This middleware handles file uploads for temporary storage. It utilizes multer to save uploaded files to a temporary directory.
 *              Files are saved with their original names in the 'public/temp' folder, ready for further processing or uploading to Instagram.
 */

const multer = require("multer");

// Configure storage options for multer
const storage = multer.diskStorage({
  // Define destination directory for uploaded files
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // Store uploaded files in the 'public/temp' directory
  },
  // Preserve original file name for the uploaded file
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for the uploaded file
  },
});

// Initialize multer with defined storage configuration
const tempUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Set limit for file size (5 MB) - Instagram has limits on media file sizes
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific file types (e.g., images) for Instagram
    const filetypes = /jpeg|jpg|png|gif/; // Supported file types
    const mimetype = filetypes.test(file.mimetype); // Check if file type is valid
    const extname = filetypes.test(
      file.originalname.split(".").pop().toLowerCase()
    ); // Check file extension

    if (mimetype && extname) {
      return cb(null, true); // Accept file
    }
    cb(new Error("Error: File type not supported!")); // Reject file if invalid
  },
});

module.exports = { tempUpload };

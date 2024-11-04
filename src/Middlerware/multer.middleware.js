/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 01-11-2024
 * Description: This middleware handles file uploads for temporary storage. It utilizes multer to save uploaded files to a temporary directory.
 *              Files are saved with their original names in the 'public/temp' folder, ready for further processing or uploading to Instagram.
 */

const multer = require("multer");

// Configure storage for profile pictures
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/profile"); // Directory for profile pictures
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  },
});

// Configure storage for other images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp/images"); // Directory for other images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use original file name
  },
});

// Define file filter for profile pictures (JPEG and PNG only)
const profilePicFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    file.originalname.split(".").pop().toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(
    new Error(
      "Error: Only JPEG and PNG files are allowed for profile pictures!"
    )
  );
};

// Define file filter for other images (JPEG, PNG, and GIF allowed)
const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(
    file.originalname.split(".").pop().toLowerCase()
  );

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: File type not supported!"));
};

// Initialize multer for profile pictures (single file)
const uploadProfilePic = multer({
  storage: profilePicStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit of 5 MB
  fileFilter: profilePicFilter,
});

// Initialize multer for other images (multiple files)
const uploadImages = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit of 5 MB per file
  fileFilter: imageFilter,
});

module.exports = { uploadProfilePic, uploadImages };

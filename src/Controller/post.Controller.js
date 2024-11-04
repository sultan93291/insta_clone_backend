/*
 * author: Md. Abib Ahmed Dipto
 * date: 11-02-2024
 * description: Controller file for user-related actions, including signup, login, profile management, and logout.
 */

// Dependencies

// Internal dependencies

const { createTestAccount } = require("nodemailer");
const {
  hashUserPassword,
  verifyPassword,
  decodeSessionToken,
  createSessionToken,
} = require("../Helpers/helper");

const { asyncHandler } = require("../Utils/asyncHandler");
const { uploadCloudinary } = require("../Utils/upCloudinary");
const { ApiError } = require("../Utils/ApiError");
const { ApiSuccess } = require("../Utils/ApiSuccess");

const createPost = asyncHandler(async (req, res, next) => {
  const { caption, likes, comments } = req.body;
  const images = req.files?.image;

  // Check if images are provided
  if (!images || images.length === 0) {
    return res.status(400).json({ message: "No images provided." });
  }

  // Map over the images array to get their file paths
  const imagePaths = images.map((file) => file.path); // Extract the path of each file

  // Upload images to Cloudinary and set the target folder
  const cloudinaryResults = await uploadCloudinary(imagePaths, "postImages");
  if (cloudinaryResults) {
    console.log(cloudinaryResults);
    return res.send("ok");
  }
  
});

module.exports = { createPost };

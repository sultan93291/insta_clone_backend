/**
 * @fileoverview This module handles uploading images to Cloudinary and removes the local copy after upload.
 * @author Md. Abib Ahmed Dipto
 * @description Uploads an image to a specified Cloudinary folder and deletes the local file upon successful upload.
 * @date 2024-11-01
 * @copyright © abib.web.dev@gmail.com
 */

// Importing required modules
const cloudinary = require("cloudinary").v2; // Cloudinary library for image uploading
const fs = require("fs"); // File system module for file operations

// Configuring Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_SERVER_NAME, // Cloudinary cloud name
  api_key: process.env.CLOUD_API_KEY, // Cloudinary API key
  api_secret: process.env.CLOUD_API_PASS, // Cloudinary API secret
});

/**
 * Asynchronously uploads an image file to Cloudinary and deletes the local file after a successful upload.
 * @param {string} localFilePath - The path to the local file to be uploaded.
 * @returns {Promise<Object|null>} The result of the upload operation or null if an error occurred.
 */
const uploadCloudinary = async (localFilePath = "public/temp/demo.jpg") => {
  try {
    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: "insta/images/profilePicture", // Target folder in Cloudinary
    });

    // Delete the local file after a successful upload
    fs.unlinkSync(localFilePath); // Synchronously remove the local file

    return uploadResult; // Return the result of the upload operation
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error); // Log any errors that occur during upload
    return null; // Return null in case of an error
  }
};

// Exporting the upload function for use in other modules
module.exports = { uploadCloudinary };

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
 * Uploads an array of image files to Cloudinary and deletes local files after a successful upload.
 * @param {string[]} localFilePaths - Array of paths to local files to be uploaded.
 * @param {string} folder - The target folder in Cloudinary for uploaded files (e.g., "profilePictures" or "postImages").
 * @returns {Promise<Array>} An array of results from the upload operation, or an error for any failed uploads.
 */
const uploadCloudinary = async (localFilePaths, folder) => {
  try {
    // Map each file path to a Cloudinary upload promise
    const uploadPromises = localFilePaths.map(async (filePath) => {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: `insta/images/${folder}`, // Use dynamic folder based on function argument
      });
      fs.unlinkSync(filePath); // Delete the local file after successful upload
      return uploadResult; // Return the Cloudinary upload result
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    return results; // Return array of upload results
  } catch (error) {
    console.error("Error uploading multiple images to Cloudinary:", error);
    return null; // Return null in case of an error
  }
};

// Exporting the upload function for use in other modules
module.exports = { uploadCloudinary };

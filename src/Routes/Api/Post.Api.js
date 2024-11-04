/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 04-10-2024
 * Description: Defines the routing for user authentication-related API endpoints,
 * including routes for user signup, login, profile retrieval, and logout functionalities.
 * Copyright: abib.web.dev@gmail.com
 */

// Import necessary dependencies
const express = require("express");
const router = express.Router();

// Import helper functions
const { authguard } = require("../../Middlerware/authGuard");
const { uploadImages } = require("../../Middlerware/multer.middleware");

// Import controller functions
const { createPost } = require("../../Controller/post.Controller");

// ========================
// User Authentication Routes
// ========================

// POST /signup - Register a new user
router
  .route("/create-post")
  .post(
    authguard,
    uploadImages.fields([{ name: "image", maxCount: 10 }]),
    createPost
  );

// Export the router for use in the main application
module.exports = router;

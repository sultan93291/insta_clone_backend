/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 04-10-2024
 * Description: This file defines the routing for user authentication-related API endpoints.
 * It includes routes for user signup, login, profile retrieval, and logout functionalities.
 * Copyright: abib.web.dev@gmail.com
 */

// Import necessary dependencies
const express = require("express"); // Import express for routing
const router = express.Router(); // Create a new router instance


// Import helper functions
const { authguard } = require("../../Middlerware/authGuard"); // Middleware for route protection
const { tempUpload } = require("../../Middlerware/multer.middleware");


// Import controller functions
const {
  signupUser,
  loginUser,
  getUserProfile,
  logOutUser,
  updateUser,
} = require("../../Controller/user.Controller"); // User-related controller functions

// ========================
// User Authentication Routes
// ========================

// POST /signup - Register a new user
router.route("/signup").post(signupUser);

// POST /login - Authenticate an existing user
router.route("/login").post(loginUser);

// ========================
// User Profile Routes
// ========================

// GET /:userName - Retrieve a user profile
// Protected by authguard middleware
router.route("/:userName").get(authguard, getUserProfile);

// GET /accounts/logout - Log out the authenticated user
// Protected by authguard middleware
router.route("/accounts/logout").get(authguard, logOutUser);

// ========================
// User Update Routes
// ========================

// PUT /accounts/edit - Update user profile information
// Protected by authguard middleware
router
  .route("/accounts/edit")
  .put(authguard, tempUpload.single("profilePicture"), updateUser);

// Export the router for use in the main application
module.exports = router;

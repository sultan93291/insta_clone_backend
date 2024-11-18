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
const { uploadProfilePic } = require("../../Middlerware/multer.middleware");

// Import controller functions
const {
  signupUser,
  loginUser,
  getUserProfile,
  logOutUser,
  updateUser,
  getSuggestedUsers,
  followAndUnfollow,
} = require("../../Controller/user.Controller");

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

// GET /:userName - Retrieve a user profile (Protected)
router.route("/:userName").get(authguard, getUserProfile);

// GET /accounts/logout - Log out the authenticated user (Protected)
router.route("/accounts/logout").get(authguard, logOutUser);

// GET /accounts/suggested-users - Retrieve suggested users (Protected)
router.route("/accounts/suggested-users").get(authguard, getSuggestedUsers);

// ========================
// User Update Routes
// ========================

// PUT /accounts/edit - Update user profile information (Protected, with file upload)
router
  .route("/accounts/edit")
  .put(authguard, uploadProfilePic.single("profilePicture"), updateUser);

// PUT /accounts/:username - Follow or unfollow a user (Protected)
router
  .route("/accounts/follow-unfollow/:username")
  .put(authguard, followAndUnfollow);

// Export the router for use in the main application
module.exports = router;

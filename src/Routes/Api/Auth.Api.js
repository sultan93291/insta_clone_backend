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
router.post("/signup", signupUser);

// POST /login - Authenticate an existing user
router.post("/login", loginUser);

// ========================
// User Profile Routes
// ========================

// GET /:userName - Retrieve a user profile (Protected)
router.get("/:userName", authguard, getUserProfile);

// GET /accounts/logout - Log out the authenticated user (Protected)
router.get("/accounts/logout", authguard, logOutUser);

// GET /accounts/suggested-users - Retrieve suggested users (Protected)
router.get("/accounts/suggested-users", authguard, getSuggestedUsers);

// ========================
// User Update Routes
// ========================

// PUT /accounts/edit - Update user profile information (Protected, with file upload)
router.put(
  "/accounts/edit",
  authguard,
  uploadProfilePic.single("profilePicture"),
  updateUser
);

// PUT /accounts/:username - Follow or unfollow a user (Protected)
router.put("/accounts/follow-unfollow/:username", authguard, followAndUnfollow);

// Export the router for use in the main application
module.exports = router;

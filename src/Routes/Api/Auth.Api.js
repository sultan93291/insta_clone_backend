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
const { authguard } = require("../../Middlerware/authGuard"); // Import authguard middleware for route protection

// Import the controller functions
const {
  signupUser,
  loginUser,
  getUserProfile,
  logOutUser,
} = require("../../Controller/user.Controller"); // Import user-related controller functions

// Define routes

// POST /signup - Route for user signup
// Calls the signupUser controller function to handle user registration
router.route("/signup").post(signupUser);

// POST /login - Route for user login
// Calls the loginUser controller function to handle user authentication
router.route("/login").post(loginUser);

// GET /:userName - Route to get a user profile
// Protected by authguard middleware. Calls getUserProfile to retrieve details for a specified user.
router.route("/:userName").get(authguard, getUserProfile);

// GET /accounts/logout - Route for user logout
// Protected by authguard middleware. Calls logOutUser to log out the authenticated user and clear the session cookie.
router.route("/accounts/logout").get(authguard, logOutUser);

// Export the router to be used in the main application
module.exports = router;

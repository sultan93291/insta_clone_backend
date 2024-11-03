/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 04-10-2024
 * Description: This file defines the routing for user authentication-related API endpoints.
 * Currently, it includes a route for user signup. Additional routes may be added in the future.
 * Copyright: abib.web.dev@gmail.com
 */

// Import necessary dependencies
const express = require("express"); // Import express for routing
const router = express.Router(); // Create a new router instance

// helper functions
const {authguard}  = require("../../Middlerware/authGuard")

// Import the controller functions
const { signupUser , loginUser , getUserProfile } = require("../../Controller/user.Controller"); // Import signup user function from the controller

// Define routes
router.route("/signup").post(signupUser); // Route for user signup
router.route("/login").post(loginUser); // Route for user login
router.route("/:userName").get(authguard,getUserProfile); // Route for user login

// Export the router to be used in the main application
module.exports = router;

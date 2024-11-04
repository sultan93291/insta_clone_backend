const express = require("express");
const { Router } = express;
const router = Router();

// Internal dependencies

// All route dependencies for the Insta Clone app
const authRoutes = require("./Api/Auth.Api");
const postRoutes = require("./Api/Post.Api");

// Helper files for standardizing API responses
const { ApiError } = require("../Utils/ApiError");
const { ApiSuccess } = require("../Utils/ApiSuccess");

// Initialization of routes
// Main GET route to check if the API is running
router.route(process.env.API_VERSION).get((req, res) => {
  return res.json(
    new ApiSuccess(
      true,
      "Successfully initialized the Insta Clone app",
      200,
      null,
      false
    )
  );
});

// Use defined routes with the specified version name
router.use(process.env.API_VERSION, authRoutes);
router.use(process.env.API_VERSION, postRoutes);

// Handle invalid routes
router.use(process.env.API_VERSION, (req, res) => {
  res.status(404).json(new ApiError(404, "API Route Invalid!", null, false));
});

// Exporting the router for use in the main application
module.exports = router;

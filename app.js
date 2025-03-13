{
  /*
   * author: Md. Abib Ahmed Dipto
   * date: 28-10-2024
   * description: This is the main file for the Orbei backend process. This file is the main entry point for handling all backend processes, triggering events, and serving as the primary helper for the index file.
   * project: Insta Clone App Backend
   * copyright: abib.web.dev@gmail.com
   */
}

// External dependencies
const express = require("express"); // Express framework for building APIs
const chalk = require("chalk"); // Chalk for colorful console logs
const cors = require("cors"); // CORS middleware for handling cross-origin requests
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies
const {app , server} = require("./src/Socket/Socket")

// Internal dependencies
const allRoutes = require("./src/Routes/index"); // Import all defined routes

// Set up the server port, defaulting to 8000 if not specified
const PORT = process.env.PORT || 8000; // Use environment variable or default to 8000

// Middleware for parsing JSON request bodies
app.use(express.json()); // Enable parsing of JSON payloads in incoming requests

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true })); // Enable parsing of URL-encoded payloads

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors()); // Allow cross-origin requests for all routes

// Parse cookies for incoming requests
app.use(cookieParser()); // Enable cookie parsing for incoming requests

// Apply all routes
app.use(allRoutes); // Use all routes imported from the routes file

// Main error handler function for capturing and responding with errors
app.use((err, req, res, next) => {
  // Capture errors that occur during request handling
  const statusCode = err.status || 500; // Set status code to error's status or 500 by default
  res.status(statusCode).json({
    statusCode: statusCode, // Response status code
    success: false, // Success flag
    message: err.message, // Error message
    data: err.data || null, // Additional error data, if available
  });
});

// Start the server on the specified port and log a success message
server.listen(PORT, () => {
  console.log(
    chalk.bgBlueBright(
      `Listening on port http://localhost:${PORT}${process.env.API_VERSION}`
    )
  ); // Display a message with the URL where the server is running
});

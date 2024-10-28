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
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Internal dependencies
const allRoutes = require("./src/Routes/index")

// Initialize the router and app instances
const app = express();

// accessing all  routes though  the router
app.use(allRoutes)

// Set up the server port, defaulting to 8000 if not specified
const PORT = process.env.PORT || 8000;

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse cookies for incoming requests
app.use(cookieParser());



// Main error handler function for capturing and responding with errors
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    statusCode: statusCode,
    success: false,
    message: err.message,
    data: err.data || null,
  });
});

// Start the server on the specified port and log a success message
app.listen(PORT, () => {
  console.log(
    chalk.bgBlueBright(
      `Listening on port http://localhost:${PORT}${process.env.API_VERSION}`
    )
  );
});

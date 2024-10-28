/*
 * author: Md. Abib Ahmed Dipto
 * date: 28-10-2024
 * description: This is the entry point for the Insta Clone App backend server. It loads environment variables, imports the main application file, and starts the server.
 */

// Load environment variables from the .env file
require("dotenv").config();

// Dependencies

// Internal Dependencies
const { ConnectDb } = require("./src/ConnectDb/ConnectDb");

// Import the main Express app instance from the app file
const app = require("./app");

//Calling the database
ConnectDb();
{
  /*
   * author: Md. Abib Ahmed Dipto
   * date: 28-10-2024
   * description: This file is responsible for establishing a connection to the MongoDB database for the Insta Clone App. It takes the database URL from environment variables and attempts to connect. If successful, it logs a confirmation message; otherwise, it logs an error.
   * project: Insta Clone App Backend
   * copyright: abib.web.dev@gmail.com
   */
}

// Dependencies

// External dependencies
const mongoose = require("mongoose");
const chalk = require("chalk");

// Internal dependencies
const DB_Name = require("../Constant/Constant");

// Initialize connection status, set to false by default
let isConnected = false;

// Database connection function
const ConnectDb = async () => {
  try {
    // Check if the database is already connected
    if (isConnected) {
      console.log(chalk.bgYellowBright("Already connected to the database"));
      return;
    }

    // Attempt to connect to MongoDB using the provided URL and database name
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: DB_Name,
    });

    // Set connection status to true upon successful connection
    isConnected = true;
    console.log(chalk.bgGreenBright("Successfully connected to the database"));
  } catch (e) {
    // Log any connection errors
    console.log(chalk.bgRedBright("Database connection error:", e));
  }
};

// Exporting the ConnectDb function to be used in other parts of the application
module.exports = { ConnectDb };

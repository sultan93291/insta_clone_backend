/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 11-16-2024
 * Description: Defines routing for message-related API endpoints in the messaging functionality
 *              of the Instagram clone application. Includes routes for sending messages between users.
 * Copyright: abib.web.dev@gmail.com
 */

// Import necessary dependencies
const express = require("express");
const router = express.Router();

// Import middleware
const { authguard } = require("../../Middlerware/authGuard");

// Import controller functions
const { sendMessage } = require("../../Controller/message.Controller");


// ========================
// Message Routes for Instagram Clone
// ========================

// POST /send-message/user/:id - Send a message to a specific user
router.route("/send-message/user/:id").post(authguard, sendMessage);

// Export the router for use in the main application
module.exports = router;

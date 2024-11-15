/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 11-16-2024
 * Description: Routing for message-related API endpoints in the Instagram clone application.
 *              Includes routes for sending messages and fetching conversations between users.
 * Copyright: abib.web.dev@gmail.com
 */

// Import necessary dependencies
const express = require("express");
const router = express.Router();

// Import middleware
const { authguard } = require("../../Middlerware/authGuard");


// Import controller functions
const {sendMessage , getMessage } = require("../../Controller/message.Controller");


// =============================
// Message Routes for Instagram Clone
// =============================

// Route: POST /api/messages/send/:id
// Description: Send a message to a specific user
// Access: Protected
router.post("/send-message/user/:id", authguard, sendMessage);

// Route: GET /api/messages/:id
// Description: Get all messages in a conversation with a specific user
// Access: Protected
router.get("/get-message/user/:id", authguard, getMessage);

// Export the router for use in the main application
module.exports = router;

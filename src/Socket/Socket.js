/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 28-10-2024
 * Description: This is the main server file that initializes an Express app,
 *              creates an HTTP server, and sets up a WebSocket server using Socket.io.
 */

// External dependencies
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

// Create an HTTP server instance
const server = http.createServer(app);

// Initialize a WebSocket server with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Allow frontend to connect from this origin
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});

// Store mapping of user IDs to their corresponding socket IDs
const userSocketMap = {};

// Handle new WebSocket connections
io.on("connection", (socket) => {
  // Extract user ID from the client's handshake query parameters
  const userId = socket.handshake.query.userId;

  // If userId is provided, store it in the mapping
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User connected. User ID: ${userId}, Socket ID: ${socket.id}`);
  }

  // Emit updated list of online users to all connected clients
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on("disconnect", () => {
    if (userId) {
      console.log(
        `User disconnected. User ID: ${userId}, Socket ID: ${socket.id}`
      );

      // Remove the user from the mapping
      delete userSocketMap[userId];

      // Broadcast updated online users list
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});



module.exports = {
  app,
  io,
  server,
};

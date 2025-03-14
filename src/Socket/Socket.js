/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 28-10-2024
 * Description: Initializes an Express app, HTTP server, and WebSocket server using Socket.io.
 */

// External dependencies
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

// Helper function to broadcast the updated online users list
const emitOnlineUsers = () =>
  io.emit("getOnlineUser", Object.keys(userSocketMap));

// Handle new WebSocket connections
io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  if (!userId) return socket.disconnect(); // Disconnect if userId is missing

  userSocketMap[userId] = socket.id;
  console.log(`User connected - ID: ${userId}, Socket: ${socket.id}`);
  emitOnlineUsers();

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    console.log(`User disconnected - ID: ${userId}`);
    emitOnlineUsers();
  });
});

module.exports = { app, io, server };

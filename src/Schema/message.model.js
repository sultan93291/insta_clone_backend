/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file contains the message schema for the Instagram clone application.
 * It defines the structure of message documents in the MongoDB database.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External Dependencies
const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// Define the message schema
const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the user model
      required: [true, "Sender ID is required"], // Sender ID is mandatory
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the user model
      required: [true, "Receiver ID is required"], // Receiver ID is mandatory
    },
    message: {
      type: String,
      required: [true, "Message info is required"],
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Export the message model, using existing model if it already exists
const messageModel = models.message || model("message", messageSchema); // Use messageSchema
module.exports = { messageModel };

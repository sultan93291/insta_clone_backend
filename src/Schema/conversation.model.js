/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file contains the conversation schema for the Instagram clone application.
 * It defines the structure of conversation documents in the MongoDB database.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External Dependencies
const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// Define the conversation schema
const conversationSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference to the user model
        required: true, // Ensure participants are required
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "message", // Reference to the message model
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Export the conversation model, using existing model if it already exists
const conversationModel =
  models.conversation || model("conversation", conversationSchema); // Use conversationSchema
module.exports = { conversationModel };

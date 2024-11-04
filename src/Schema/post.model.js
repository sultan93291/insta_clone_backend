/*
 * author: Md . Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file contains the post schema for the Instagram clone application.
 * It defines the structure of post documents in the MongoDB database.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External Dependencies
const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// Define the post schema
const postSchema = new Schema(
  {
    caption: {
      type: String,
      default: "", // Default value if no caption is provided
    },
    image: {
      type: [String], // Array of strings to store multiple image URLs
      required: [true, "At least one image is required"],
      validate: {
        validator: function (array) {
          return array.length > 0;
        },
        message: "At least one image is required",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the user model
      required: [true, "author info is required"], // Author is mandatory
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // Reference to the user model
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment", // Reference to the comment model
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Export the post model, using existing model if it already exists
const postModel = models.post || model("post", postSchema); // Use postSchema instead of userSchema
module.exports = { postModel };

/*
 * author: Md . Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file contains the comment schema for the Instagram clone application.
 * It defines the structure of comment documents in the MongoDB database.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External Dependencies
const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// Define the comment schema
const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"], // Comment text is mandatory
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // Reference to the user model
      required: [true, "Author info is required"], // Author is mandatory
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post", // Reference to the post model
      required: [true, "Post info is required"], // Post reference is mandatory
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Export the comment model, using existing model if it already exists
const commentModel = models.comment || model("comment", commentSchema);
module.exports = { commentModel };

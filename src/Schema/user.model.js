/*
 * author: Md . Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file contains the user schema for the Instagram clone application.
 * It defines the structure of user documents in the MongoDB database.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External Dependencies
const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// Define the user schema
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"], // userName is mandatory
      unique: true, // userName must be unique across users
    },
    email: {
      type: String,
      required: [true, "email is required"], // email is mandatory
      unique: true, // email must be unique across users
    },
    password: {
      type: String,
      required: [true, "password is required"], // password is mandatory
    },
    profilePicture: {
      type: String,
      default: "", // default value if no profile picture is provided
    },
    gender: {
      type: String,
      enum: ["male", "female"], // only allow 'male' or 'female' values
    },
    bio: {
      type: String,
      default: "", // default bio if not provided
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // reference to the user model
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // reference to the user model
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post", // reference to the post model
      },
    ],
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post", // reference to the post model
      },
    ],
  },
  { timestamps: true } // automatically manage createdAt and updatedAt fields
);

// Export the user model, using existing model if it already exists
const userModel = models.user || model("user", userSchema);
module.exports = { userModel };

/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 11-05-2024
 * Description: Defines routing for post-related API endpoints in the Instagram clone application,
 *              including creating posts with multiple images.
 * Copyright: abib.web.dev@gmail.com
 */

// Import necessary dependencies
const express = require("express");
const router = express.Router();

// Import middleware
const { authguard } = require("../../Middlerware/authGuard");
const { uploadImages } = require("../../Middlerware/multer.middleware");

// Import controller functions
const { createPost , getAllPosts , likeDislikePost, addCommentToPost , getSingleUserPosts } = require("../../Controller/post.Controller");

// ========================
// Post Routes for Instagram Clone
// ========================

// POST /create-post - Create a new post with multiple images
router.route("/create-post").post(
  authguard,
  uploadImages.fields([{ name: "image", maxCount: 10 }]), // Allow up to 10 images per post
  createPost
);

// add to comment to the post
router.route("/add-comment/post/:postid").post(authguard, addCommentToPost);

// get all posts
router.route("/get/all-posts").get(authguard, getAllPosts);


// get a user all posts
router.route("/users/:username").get(authguard, getSingleUserPosts);

// like/dislike a post 
router.route("/like-dislike/post/:postid").put(authguard, likeDislikePost)

// Export the router for use in the main application
module.exports = router;

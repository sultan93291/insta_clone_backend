/*
 * Author: Md. Abib Ahmed Dipto
 * Date: 11-05-2024
 * Description: Controller file for user-related actions, including signup, login, profile management, and logout.
 */

// Dependencies

// Internal dependencies
const {
  hashUserPassword,
  verifyPassword,
  decodeSessionToken,
  createSessionToken,
} = require("../Helpers/helper");

const { asyncHandler } = require("../Utils/asyncHandler");
const { uploadCloudinary } = require("../Utils/upCloudinary");
const { ApiError } = require("../Utils/ApiError");
const { ApiSuccess } = require("../Utils/ApiSuccess");
const { postModel } = require("../Schema/post.model");
const { userModel } = require("../Schema/user.model");

const createPost = asyncHandler(async (req, res, next) => {
  const { caption, likes, comments } = req.body;
  const images = req.files?.image;

  // Retrieve user information from token in cookie
  const decodedData = await decodeSessionToken(req);

  const isExistedUser = await userModel.findById(decodedData?.userData?.userId);

  if (!isExistedUser) {
    return next(new ApiError(400, "No user exists", null, false));
  }

  // Check if images are provided
  if (!images || images.length === 0) {
    return next(new ApiError(400, "No image found", null, false));
  }

  // Map over the images array to get their file paths
  const imagePaths = images.map((file) => file.path); // Extract the path of each file

  // Upload images to Cloudinary and set the target folder
  const cloudinaryResults = await uploadCloudinary(imagePaths, "postImages");

  const imageUrls = cloudinaryResults.map((result) => result.secure_url); // Assuming Cloudinary returns 'secure_url'

  const newPost = new postModel({
    caption,
    image: imageUrls,
    author: isExistedUser._id,
    likes,
    comments,
  });

  const savedPost = await newPost.save();
  isExistedUser.posts = savedPost._id;
  await isExistedUser.save();

  const responseData = await savedPost.populate({
    path: "author",
    select: "-password -refreshToken", // Exclude sensitive fields
  });

  if (!savedPost) {
    return next(
      new ApiError(
        400,
        "Can't create a post at the moment, please try again later",
        null,
        false
      )
    );
  }

  return res
    .status(200)
    .json(
      new ApiSuccess(
        true,
        "Successfully created post",
        200,
        responseData,
        false
      )
    );
});

// get all posts mechanisms
const getAllPosts = asyncHandler(async (req, res, next) => {
  const allPosts = await postModel
    .find({})
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "userName profilePicture",
    })
    .populate({ path: "likes" })
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "author",
        select: "userName profilePicture",
      },
    });

  if (allPosts.length < 1) {
    return next(new ApiError(500, "Currently, there's no post", null, false));
  }

  return res
    .status(200)
    .json(new ApiSuccess(true, "All posts", 200, allPosts, false));
});

//get single user posts
const getSingleUserPosts = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const isExistedUser = await userModel.findById(username);
  if (!isExistedUser) {
    return next(new ApiError(500, "User not found", null, false));
  }
  const userPosts = await postModel
    .find({ id: isExistedUser._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "userName profilePicture",
    })
    .populate({ path: "likes" })
    .populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "author",
        select: "userName profilePicture",
      },
    });

  if (userPosts.length < 1) {
    return next(new ApiError(500, "Currently, there's no post", null, false));
  }

  return res
    .status(200)
    .json(new ApiSuccess(true, "user posts", 200, userPosts, false));
});

module.exports = { createPost, getAllPosts };

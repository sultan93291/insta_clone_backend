/*
 * author: Md. Abib Ahmed Dipto
 * date: 11-02-2024
 * description: Controller file for user-related actions, including signup, login, profile management, and logout.
 */

// Dependencies

// Internal dependencies

const { createTestAccount } = require("nodemailer");
const {
  hashUserPassword,
  verifyPassword,
  decodeSessionToken,
  createSessionToken,
} = require("../Helpers/helper");
const { userModel } = require("../Schema/user.model");
const { ApiError } = require("../Utils/ApiError");
const { ApiSuccess } = require("../Utils/ApiSuccess");
const { asyncHandler } = require("../Utils/asyncHandler");
const { emailChecker, passwordChecker } = require("../Utils/checker");
const {uploadCloudinary} = require("../Utils/upCloudinary")
const { promises } = require("nodemailer/lib/xoauth2");

// secure cookies
const options = {
  httpOnly: true,
  secure: true,
};

// Function to handle user signup
const signupUser = asyncHandler(async (req, res, next) => {
  const { email, password, userName, fullName } = req.body;

  // Validate email
  if (!email || !emailChecker(email)) {
    return next(new ApiError(400, "Invalid email format", null, false));
  }

  // Validate password
  if (!password || !passwordChecker(password)) {
    return next(new ApiError(400, "Invalid password format", null, false));
  }

  // Validate full name
  if (!fullName) {
    return next(new ApiError(400, "Full name is required", null, false));
  }

  // Validate username
  if (!userName) {
    return next(new ApiError(400, "Username is required", null, false));
  }

  // Check if email exists
  const existingEmailUser = await userModel.findOne({ email });

  // Check if username exists
  const existingUsernameUser = await userModel.findOne({ userName });

  // Throw an error if the email is already registered
  if (existingEmailUser) {
    return next(
      new ApiError(
        400,
        "Email is already in use, please choose another",
        null,
        false
      )
    );
  }

  // Throw an error if the username is already in use
  if (existingUsernameUser) {
    return next(
      new ApiError(
        400,
        "Username already in use, please choose another",
        null,
        false
      )
    );
  }

  // Hash the password
  const hashedPassword = await hashUserPassword(password);

  // Create new user
  const newUser = new userModel({
    userName,
    email,
    password: hashedPassword,
    fullName,
  });

  // Save new user to database
  const savedUser = await newUser.save();

  // Handle potential save errors
  if (!savedUser) {
    return next(
      new ApiError(
        500,
        "Unable to create a user right now. Please try again later.",
        null,
        false
      )
    );
  }

  // Successful response
  return res
    .status(201)
    .json(new ApiSuccess(true, "User created successfully", 201, savedUser));
});

// Function to handle user login
const loginUser = asyncHandler(async (req, res, next) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Validate email format
  if (!email || !emailChecker(email)) {
    return next(new ApiError(400, "Invalid email format", null, false));
  }

  // Validate password format
  if (!password || !passwordChecker(password)) {
    return next(new ApiError(400, "Invalid password format", null, false));
  }

  // Check if the user exists with the given email
  const existingUser = await userModel.findOne({ email });

  // If the user does not exist, return an error
  if (!existingUser) {
    return next(new ApiError(400, "Invalid username or password", null, false));
  }

  // Verify the provided password with the stored hashed password
  const isVerifiedPass = await verifyPassword(password, existingUser.password);

  // If the password is incorrect, return an error
  if (!isVerifiedPass) {
    return next(new ApiError(400, "Invalid username or password", null, false));
  }

  // Prepare user data for the session
  const userData = {
    userId: existingUser._id,
    userName: existingUser.userName,
    userEmail: existingUser.email,
    isVerified: existingUser.isVerified,
  };

  // Create a session token for the user
  const token = await createSessionToken(userData);

  // Store the refresh token in the user document
  existingUser.refreshToken = token;
  await existingUser.save(); // Make sure to await the save operation

  // Send the token as a cookie and return a success response
  return res
    .status(200)
    .cookie("access_token", token, options) // Ensure 'options' is defined correctly
    .json(new ApiSuccess(true, "Successfully logged in", 200, userData, false));
});

// Function to retrieve user profile information
const getUserProfile = asyncHandler(async (req, res, next) => {
  // Get userName from request parameters
  const { userName } = req.params;

  // Find user by userName
  const isExistedUser = await userModel.findOne({ userName });

  // If user does not exist, return an error
  if (!isExistedUser) {
    return next(new ApiError(400, "User doesn't exist", null, false));
  }

  // Prepare user data for response
  const userData = {
    userName: isExistedUser.userName,
    fullName: isExistedUser.fullName,
    profilePicture: isExistedUser.profilePicture,
    bio: isExistedUser.bio,
    isVerified: isExistedUser.isVerified,
    followersCount: isExistedUser.followers.length,
    followingCount: isExistedUser.following.length,
    posts: isExistedUser.posts, // Includes populated posts details
    bookmarks: isExistedUser.bookmarks, // Includes populated bookmarks details
    createdAt: isExistedUser.createdAt,
  };

  // Return successful response
  return res
    .status(200)
    .json(
      new ApiSuccess(
        true,
        "Successfully retrieved user profile",
        200,
        userData,
        false
      )
    );
});

// Function to update user information
const updateUser = asyncHandler(async (req, res, next) => {
  // retrieve user updated data from body
  const { userName, email, bio, gender, fullName } = req.body;

  // retrieve profile picture from request file
  const profilePicture = req.file;

  // Check if none of the fields are provided
  if (!userName && !email && !bio && !gender && !fullName && !profilePicture) {
    return next(
      new ApiError(
        400,
        "Nothing to update. Please provide data to update and try again.",
        null,
        false
      )
    );
  }

  // Validate email if it's provided
  if (email && !emailChecker(email)) {
    return next(new ApiError(400, "Invalid email format", null, false));
  }

  // Retrieve user information from token in cookie
  const decodedData = await decodeSessionToken(req);
  const isExistedUser = await userModel.findById(decodedData?.userData?.userId);

  if (!isExistedUser) {
    return next(new ApiError(400, "User doesn't exist", null, false));
  }

  let imageurl;

  if (profilePicture) {
    imageurl = await uploadCloudinary(profilePicture.path,"profilePicture");
  }

  // Update only fields that are provided in the request
  isExistedUser.userName = userName || isExistedUser.userName;
  isExistedUser.email = email || isExistedUser.email;
  isExistedUser.bio = bio || isExistedUser.bio;
  isExistedUser.gender = gender || isExistedUser.gender;
  isExistedUser.fullName = fullName || isExistedUser.fullName;
  isExistedUser.profilePicture =
    imageurl.secure_url || isExistedUser.profilePicture;

  // Save the updated user document
  await isExistedUser.save();

  // Prepare response data
  const userData = {
    userName: isExistedUser.userName,
    fullName: isExistedUser.fullName,
    profilePicture: isExistedUser.profilePicture,
    bio: isExistedUser.bio,
    isVerified: isExistedUser.isVerified,
    followersCount: isExistedUser.followers.length,
    followingCount: isExistedUser.following.length,
    posts: isExistedUser.posts, // Includes populated posts details
    bookmarks: isExistedUser.bookmarks, // Includes populated bookmarks details
    createdAt: isExistedUser.createdAt,
  };

  return res
    .status(200)
    .json(
      new ApiSuccess(
        true,
        "Successfully updated user data",
        200,
        userData,
        false
      )
    );
});

// Function to get suggested users
const getSuggestedUsers = asyncHandler(async (req, res, next) => {
  // Retrieve user information from token in cookie
  const decodedData = await decodeSessionToken(req);

  // Fetch users excluding the current user
  const suggestedUsers = await userModel
    .find({ _id: { $ne: decodedData?.userData?.userId } })
    .select("-password");

  // Check if there are no suggested users
  if (suggestedUsers.length === 0) {
    return next(new ApiError(400, "Currently no suggested users", null, false));
  }

  // Return the suggested users
  return res
    .status(200)
    .json(
      new ApiSuccess(
        true,
        "Successfully retrieved suggested users",
        200,
        suggestedUsers,
        false
      )
    );
});

// Function to  follow or unfollow a user
const followAndUnfollow = asyncHandler(async (req, res, next) => {
  // Retrieve data from params
  const { username } = req.params;
  // Retrieve user information from token in cookie
  const decodedData = await decodeSessionToken(req);

  // Fetch the logged-in user
  const loggedInUser = await userModel.findById(decodedData?.userData?.userId);
  const targetedUser = await userModel.findOne({ userName: username });

  if (!loggedInUser) {
    return next(new ApiError(400, "Logged in user doesn't exist", null, false));
  }
  if (!targetedUser) {
    return next(new ApiError(400, "User doesn't exist", null, false));
  }

  if (loggedInUser._id.equals(targetedUser._id)) {
    return next(new ApiError(400, "You can't follow yourself", null, false));
  }

  const isFollowing = loggedInUser.following.includes(targetedUser._id);

  if (isFollowing) {
    // Unfollow: remove the targeted user from the logged-in user's following list
    // and remove the logged-in user from the targeted user's follower list
    await Promise.all([
      userModel.findByIdAndUpdate(loggedInUser._id, {
        $pull: { following: targetedUser._id },
      }),
      userModel.findByIdAndUpdate(targetedUser._id, {
        $pull: { followers: loggedInUser._id }, // Remove from followers
      }),
    ]);
    return res
      .status(200)
      .json(
        new ApiSuccess(true, `Successfully unfollowed ${targetedUser.userName}`)
      );
  } else {
    // Follow: add the targeted user to the logged-in user's following list
    // and add the logged-in user to the targeted user's follower list
    await Promise.all([
      userModel.findByIdAndUpdate(loggedInUser._id, {
        $push: { following: targetedUser._id },
      }),
      userModel.findByIdAndUpdate(targetedUser._id, {
        $push: { followers: loggedInUser._id }, // Add to followers
      }),
    ]);
    return res
      .status(200)
      .json(
        new ApiSuccess(true, `Successfully followed ${targetedUser.userName}`)
      );
  }
});

// Function to handle user logout
const logOutUser = asyncHandler(async (req, res, next) => {
  // Clear the 'access_token' cookie by setting it to an empty value with custom options
  return res
    .status(200)
    .cookie("access_token", "", options)
    .json(new ApiSuccess(true, "successfully logged out", 200, null, false));
});

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  updateUser,
  logOutUser,
  getSuggestedUsers,
  followAndUnfollow
};

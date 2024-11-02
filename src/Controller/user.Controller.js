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

  // Check if email or username is already in use
  const isExistedUser = await userModel.findOne({
    $or: [{ email }, { userName }],
  });

  if (isExistedUser) {
    return next(
      new ApiError(400, "Already registered, please login", null, false)
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
    .json(
      new ApiSuccess(true, "Successfully logged in", 200, userData, false) 
    );
});

// Function to retrieve user profile information
const getUserProfile = asyncHandler(async (req, res, next) => {
  // Logic to fetch user profile data will go here
});

// Function to update user information
const updateUser = asyncHandler(async (req, res, next) => {
  // Logic to update user details will go here
});

// Function to handle user sign-out
const signOutUser = asyncHandler(async (req, res, next) => {
  // Logic for signing out the user will go here
});

// Function to handle user logout
const logOutUser = asyncHandler(async (req, res, next) => {
  // Logic for logging out the user will go here
});

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  updateUser,
  signOutUser,
  logOutUser,
};

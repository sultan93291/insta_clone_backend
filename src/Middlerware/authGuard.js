/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: This file is the authguard file. It checks if a logged-in user has a valid access token.
 *              If a valid token exists, the user is authenticated; otherwise, access is denied.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies

// External dependencies
const jwt = require("jsonwebtoken");

// Internal dependencies
const { ApiError } = require("../Utils/ApiError");
const { asyncHandler } = require("../Utils/asyncHandler");

// Helper function to verify the token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return null; // Return null if token verification fails
  }
};

// Auth guard mechanism
const authguard = asyncHandler(async (req, res, next) => {
  const { cookie, authorization } = req.headers;


  // Retrieve token directly from authorization header or cookies
  const token = authorization?.startsWith("Bearer ")
    ? authorization.split("Bearer ")[1].split("@")[1]
    : null;
  
  const cookiesToken = cookie
    ?.split("; ")
    .find((c) => c.startsWith("access_token="))
    ?.split("=")[1];
  
  
  // If no token is found, respond with an unauthorized error
  if (!token && !cookiesToken) {
    return next(
      new ApiError(401, "Unauthorized. Access token required.", null, false)
    );
  }

  // Verify the token (from authorization header or cookies)
  const decoded = verifyToken(token || cookiesToken);

  // If the token is invalid, respond with an unauthorized error
  if (!decoded) {
    return next(
      new ApiError(
        401,
        "Unauthorized. Invalid or expired access token.",
        null,
        false
      )
    );
  }

  // Token is valid, proceed to the next middleware
  next();
});

module.exports = { authguard };

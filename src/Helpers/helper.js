/*
 * author: Md. Abib Ahmed Dipto
 * date: 05-09-2024
 * description: Helper file for the Instagram backend - handles token generation, password encryption, and decoding.
 * copyright: abib.web.dev@gmail.com
 */

// Dependencies
// External dependencies
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Hashes the user's password for secure storage.
 * @param {string} password - The plain text password of the user.
 * @returns {string} The hashed password.
 */
const hashUserPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Password hashing error:", error.message);
  }
};

/**
 * Verifies if the given plain text password matches the stored hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
const verifyPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Password verification error:", error.message);
  }
};

/**
 * Generates a JWT access token for the user's session.
 * @param {object} userData - The user's data to be encoded in the token.
 * @returns {string} The generated JWT access token.
 */
const createSessionToken = async (userData) => {
  try {
    const secretKey = userData?.isReset
      ? process.env.RESET_SECRET_KEY
      : process.env.SECRET_KEY;

    return jwt.sign(
      { userData },
      secretKey,
      { expiresIn: process.env.EXPIRES_IN } // e.g., '1h'
    );
  } catch (error) {
    console.error("Error generating session token:", error);
  }
};

/**
 * Decodes the provided JWT token without verification, used for extracting user information.
 * @param {object} req - The request object containing headers or cookies.
 * @returns {object|null} The decoded token data or null if decoding fails.
 */
const decodeSessionToken = async (req) => {
  try {
    const { cookie, authorization } = req.headers;

    const tokenFromAuth = authorization?.split("Bearer ")[1]?.split("@")[1];
    const tokenFromCookies = cookie
      ?.split("; ")
      .find(
        (c) => c.startsWith("session_token=") || c.startsWith("reset_token=")
      )
      ?.split("=")[1];

    const token = tokenFromAuth || tokenFromCookies;
    return token ? jwt.decode(token) : null;
  } catch (error) {
    console.error("Error decoding session token:", error.message);
    return null;
  }
};

module.exports = {
  createSessionToken,
  hashUserPassword,
  verifyPassword,
  decodeSessionToken,
};

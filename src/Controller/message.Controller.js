// File: sendMessageController.js
// Author: Md. Abib Ahmed Dipto
// Date: 2024-11-16
// Description: Controller function for handling the "sendMessage" API endpoint,
// allowing authenticated users to send messages to other users.

const { decodeSessionToken } = require("../Helpers/helper");
const { conversationModel } = require("../Schema/conversation.model");
const { messageModel } = require("../Schema/message.model");
const { userModel } = require("../Schema/user.model");
const { ApiError } = require("../Utils/ApiError");
const { ApiSuccess } = require("../Utils/ApiSuccess");
const { asyncHandler } = require("../Utils/asyncHandler");

/**
 * sendMessage - Handles sending messages between authenticated users.
 * @route POST /api/messages/:id
 * @access Protected
 * @param {Object} req - Express request object, contains user ID in params and message in body.
 * @param {Object} res - Express response object for sending back responses.
 * @param {Function} next - Express middleware function for error handling.
 */


const sendMessage = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // The recipient's user ID
  const { message } = req.body; // The message content

  // Validation: Ensure the message content is provided
  if (!message) {
    return next(new ApiError(400, "Nothing to send", null, false));
  }

  // Decode session token and fetch the logged-in user
  const decodedData = await decodeSessionToken(req); // Ensure decodeSessionToken is properly implemented
  const loggedInUser = await userModel.findById(decodedData?.userData?.userId);

  // Prevent users from messaging themselves
  if (loggedInUser._id.toString() === id) {
    return next(new ApiError(401, "You can't message yourself", null, false));
  }

  // Validation: Ensure the logged-in user exists
  if (!loggedInUser) {
    return next(
      new ApiError(401, "Please log in again and try later", null, false)
    );
  }

  // Fetch the recipient user
  const reciverUser = await userModel.findById(id);

  // Validation: Ensure the recipient exists
  if (!reciverUser) {
    return next(
      new ApiError(
        401,
        "Receiver user doesn't exist, please try again later",
        null,
        false
      )
    );
  }

  // Check for an existing conversation between the participants
  let isPrevConversation = await conversationModel.findOne({
    participants: { $all: [loggedInUser._id, id] },
  });

  // If no conversation exists, create a new one
  if (!isPrevConversation) {
    isPrevConversation = await conversationModel.create({
      participants: [loggedInUser._id, id],
    });
  }

  // Create a new message
  const newMessage = new messageModel({
    senderId: loggedInUser._id,
    receiverId: reciverUser._id,
    message: message,
  });

  // Save the new message to the database
  const savedMessage = await newMessage.save();

  // Validation: Ensure the message was saved successfully
  if (!savedMessage) {
    return next(
      new ApiError(
        500,
        "Cannot send message right now, please try again later",
        null,
        false
      )
    );
  }

  // Add the saved message to the conversation's message list and save it
  isPrevConversation.messages.push(savedMessage._id);
  await isPrevConversation.save();

  // Respond with success and the saved message data
  return res
    .status(200)
    .json(
      new ApiSuccess(
        true,
        "Successfully sent conversation",
        200,
        savedMessage,
        false
      )
    );
});

module.exports = { sendMessage };

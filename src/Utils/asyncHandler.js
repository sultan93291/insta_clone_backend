{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : This is the async handler file. It controls all asynchronous functions, allowing us to avoid
   * implementing try-catch blocks in every file, making error handling more consistent and cleaner.
   * copyright : abib.web.dev@gmail.com
   */
}

// Dependencies

// Internal dependencies
const { ApiError } = require("./ApiError");

// Async handler function
const asyncHandler = (fun = () => {}) => {
  return async (req, res, next) => {
    try {
      await fun(req, res, next); // Call the provided asynchronous function
    } catch (error) {
      next(
        new ApiError(500, "Async Handler Error: " + error.message, null, false) // Pass the error to the next middleware
      );
    }
  };
};

// Exporting the async handler function for use in the application
module.exports = { asyncHandler };

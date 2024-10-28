{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : This is the apiError class file. Whenever a condition is false and we need to return an error response,
   * we will use this class to create an error response object for the Instagram clone app.
   * copyright : abib.web.dev@gmail.com
   */
}

// Creating a class for sending API error responses
class ApiError {
  constructor(
    status = 400, // Default status code for bad request
    message = "An error occurred", // Default error message
    data = null, // Optional data to provide additional context
    success = false // Indicates whether the operation was successful
  ) {
    this.status = status; // HTTP status code
    this.message = message; // Error message
    this.data = data; // Additional data related to the error
    this.success = success; // Success status (always false for errors)
  }
}

// Exporting the apiError class for use in the application
module.exports = { ApiError };

{
  /*
   * author: Md . Abib Ahmed Dipto
   * date : 05-09-2024
   * description : This is the apiSuccess class file. Whenever a condition is true and we need to return a success response,
   * we will use this class to create a success response object for the Instagram clone app.
   * copyright : abib.web.dev@gmail.com
   */
}

// Creating a class for sending API success responses
class ApiSuccess {
  constructor(
    success = true, // Indicates whether the operation was successful
    message = null, // Message describing the success
    status = 200, // HTTP status code (default is 200 for success)
    data = null, // Optional data to include in the response
    error = false // Indicates whether there was an error (should be false for success)
  ) {
    this.success = success; // Success status
    this.message = message; // Success message
    this.status = status; // HTTP status code
    this.data = data; // Additional data related to the success
    this.error = error; // Error status (should be false for success)
  }
}

// Exporting the apiSuccess class for use in the application
module.exports = { ApiSuccess };

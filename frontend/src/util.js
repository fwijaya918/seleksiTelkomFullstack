/**
 * Handles errors from API requests and navigates to appropriate pages based on the error type.
 * 
 * @param {Object} error - The error object from an API request.
 * @param {Function} navigate - The navigate function from React Router for programmatic navigation.
 * @returns {Object} An object containing error details or undefined if redirection occurs.
 * 
 * @property {number} [status] - HTTP status code of the error response.
 * @property {string} [message] - Error message from the error response or the error object.
 */
const handleError = function (error, navigate) {
  if (error.response) {
    // Error response from the server (e.g., 404, 500)
    return {
      status: error.response.status,
      message: error.response.data.message,
    };
  } else if (error.request) {
    // Error occurred when making the request (e.g., network issues)
    navigate("/server-error");
  } else {
    // Other types of errors (e.g., JavaScript errors)
    return {
      message: error.message,
    };
  }
};

export default handleError;

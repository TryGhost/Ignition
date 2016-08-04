// # Request Entity Too Large Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function RequestEntityTooLargeError(message) {
    message = message || "Request was too big for the server to handle.";
    return createError('RequestEntityTooLargeError', 413, message);
}

module.exports = RequestEntityTooLargeError;
// # Unsupported Media Type Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function UnsupportedMediaTypeError(message) {
    message = message || "The media in the request is not supported by the server.";
    return createError('UnsupportedMediaTypeError', 415, message);
}

module.exports = UnsupportedMediaTypeError;
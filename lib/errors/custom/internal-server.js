// # Internal Server Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function InternalServerError(message) {
    message = message || "The server has encountered an error.";
    return createError('InternalServerError', 500, message);
}

module.exports = InternalServerError;
// # Too Many Requests Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function TooManyRequestsError(message) {
    message = message || "Server has received too many similar requests in a short space of time.";
    return createError('TooManyRequestsError', 429, message);
}

module.exports = TooManyRequestsError;
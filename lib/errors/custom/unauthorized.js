// # Unauthorized Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function UnauthorizedError(message) {
    message = message || "You are not authorised to make this request.";
    return createError('UnauthorizedError', 401, message);
}

module.exports = UnauthorizedError;
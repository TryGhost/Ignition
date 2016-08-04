// # No Permission Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function NoPermissionError(message) {
    message = message || "You do not have permission to perform this request.";
    return createError('NoPermissionError', 403, message);
}

module.exports = NoPermissionError;
// # Not Found Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function NotFoundError(message) {
    message = message || "Resource could not be found.";
    return createError('NotFoundError', 404, message);
}

module.exports = NotFoundError;
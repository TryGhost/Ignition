// # Method Not Allowed Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function MethodNotAllowedError(message) {
    message = message || "Method not allowed for resource.";
    return createError('MethodNotAllowedError', 405, message);
}

module.exports = MethodNotAllowedError;
// # Bad Request Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function BadRequestError(message) {
    message = message || "The request could not be understood.";
    return createError('BadRequestError', 400, message);
}

module.exports = BadRequestError;
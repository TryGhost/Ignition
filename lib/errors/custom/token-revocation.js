// # Token Revocation Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function TokenRevocationError(message) {
    message = message || "Token is no longer available.";
    return createError('TokenRevocationError', 503, message);
}

module.exports = TokenRevocationError;
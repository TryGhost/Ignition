// # Version Mismatch Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function VersionMismatchError(message) {
    message = message || "Requested version does not match server version.";
    return createError('VersionMismatchError', 400, message);
}

module.exports = VersionMismatchError;
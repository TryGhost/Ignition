// # Validation Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function ValidationError(message, offendingProperty) {
    message = message || "The request failed validation.";
    var validation = createError('ValidationError', 422, message);

    if (offendingProperty) {
        validation.property = offendingProperty;
    }

    return validation;
}

module.exports = ValidationError;
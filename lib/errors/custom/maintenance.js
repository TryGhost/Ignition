// # Maintenance Error
// Custom error class with status code and type prefilled.
var createError = require('../error').create;

function MaintenanceError(message) {
    message = message || "The server is temporarily down for maintenance.";
    return createError('MaintenanceError', 503, message);
}

module.exports = MaintenanceError;
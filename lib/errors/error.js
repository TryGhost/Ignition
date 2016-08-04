var utils = require('./utils');

function createError(name, statusCode, message) {
    var error = function () {};
    error.message = message;
    error.stack = new Error().stack;
    error.errorType = name;
    error.statusCode = statusCode;
    error.uid = utils.generateErrorId();

    error.prototype = Object.create(Error.prototype);
    error.prototype.name = name;

    return error;
}

module.exports.create = createError;
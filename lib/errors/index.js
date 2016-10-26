var _ = require('lodash'),
    uuid = require('node-uuid'),
    util = require('util');

function IgnitionError(options) {
    options = options || {};
    var self = this;

    if (_.isString(options)) {
        throw new Error('Please instantiate Errors with the option pattern. e.g. new errors.IgnitionError({message: ...})');
    }

    Error.call(this);
    Error.captureStackTrace(this, IgnitionError);

    /**
     * defaults
     */
    this.statusCode = 500;
    this.errorType = 'InternalServerError';
    this.level = 'normal';
    this.message = 'The server has encountered an error.';
    this.id = uuid.v1();

    /**
     * custom overrides
     */
    this.statusCode = options.statusCode || this.statusCode;
    this.level = options.level || this.level;
    this.context = options.context || this.context;
    this.help = options.help || this.help;
    this.errorType = this.name = options.errorType || this.errorType;
    this.errorDetails = options.errorDetails;
    this.code = options.code || null;

    this.message = options.message;
    this.hideStack = options.hideStack;

    // error to inherit from, override!
    // nested objects are getting copied over in one piece (can be changed, but not needed right now)
    if (options.err) {
        Object.getOwnPropertyNames(options.err).forEach(function (property) {
            if (['errorType', 'name', 'statusCode', 'message'].indexOf(property) !== -1) {
                return;
            }

            if (property === 'stack') {
                self[property] += '\n\n' + options.err[property];
                return;
            }

            self[property] = options.err[property] || self[property];
        });
    }
}

// jscs:disable
var errors = {
    IncorrectUsageError: function IncorrectUsageError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 400,
            level: 'critical',
            errorType: 'IncorrectUsageError',
            message: 'We detected a misuse. Please read the stack trace.'
        }, options));
    },
    NotFoundError: function NotFoundError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 404,
            errorType: 'NotFoundError',
            message: 'Resource could not be found.'
        }, options));
    },
    BadRequestError: function BadRequestError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 400,
            errorType: 'BadRequestError',
            message: 'The request could not be understood.'
        }, options));
    },
    UnauthorizedError: function UnauthorizedError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 401,
            errorType: 'UnauthorizedError',
            message: 'You are not authorised to make this request.'
        }, options));
    },
    NoPermissionError: function NoPermissionError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 403,
            errorType: 'NoPermissionError',
            message: 'You do not have permission to perform this request.'
        }, options));
    },
    ValidationError: function ValidationError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 422,
            errorType: 'ValidationError',
            message: 'The request failed validation.'
        }, options));
    },
    UnsupportedMediaTypeError: function UnsupportedMediaTypeError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 415,
            errorType: 'UnsupportedMediaTypeError',
            message: 'The media in the request is not supported by the server.'
        }, options));
    },
    TooManyRequestsError: function TooManyRequestsError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 429,
            errorType: 'TooManyRequestsError',
            message: 'Server has received too many similar requests in a short space of time.'
        }, options));
    },
    MaintenanceError: function MaintenanceError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 503,
            errorType: 'MaintenanceError',
            message: 'The server is temporarily down for maintenance.'
        }, options));
    },
    MethodNotAllowedError: function MethodNotAllowedError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 405,
            errorType: 'MethodNotAllowedError',
            message: 'Method not allowed for resource.'
        }, options));
    },
    RequestEntityTooLargeError: function RequestEntityTooLargeError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 413,
            errorType: 'RequestEntityTooLargeError',
            message: 'Request was too big for the server to handle.'
        }, options));
    },
    TokenRevocationError: function TokenRevocationError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 503,
            errorType: 'TokenRevocationError',
            message: 'Token is no longer available.'
        }, options));
    },
    VersionMismatchError: function VersionMismatchError(options) {
        IgnitionError.call(this, _.merge({
            statusCode: 400,
            errorType: 'VersionMismatchError',
            message: 'Requested version does not match server version.'
        }, options));
    }
};

util.inherits(IgnitionError, Error);
_.each(errors, function (error) {
    util.inherits(error, IgnitionError);
});

module.exports = errors;
module.exports.IgnitionError = IgnitionError;



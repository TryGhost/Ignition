module.exports = {
    // Create a new error
    create: require('./error'),
    // Classes
    BadRequestError: require('./custom/bad-request'),
    InternalServerError: require('./custom/internal-server'),
    MaintenanceError: require('./custom/maintenance'),
    MethodNotAllowedError: require('./custom/method-not-allowed'),
    NoPermissionError: require('./custom/no-permission'),
    NotFoundError: require('./custom/not-found'),
    RequestEntityTooLargeError: require('./custom/request-entity-too-large'),
    TokenRevocationError: require('./custom/token-revocation'),
    TooManyRequestsError: require('./custom/too-many-requests'),
    UnauthorizedError: require('./custom/unauthorized'),
    UnsupportedMediaTypeError: require('./custom/unsupported-media-type'),
    ValidationError: require('./custom/validation'),
    VersionMismatchError: require('./custom/version-mismatch')
};

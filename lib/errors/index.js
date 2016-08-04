module.exports = {
    // Create a new error
    create: require('./error'),
    // Classes
    BadRequestError: require('./custom/bad-request'),
    InternalServerError: require('./custom/internal-server'),
    MaintenanceError: require('./custom/maintenance'),
    NoPermissionError: require('./custom/no-permission'),
    NotFoundError: require('./custom/not-found'),
    RequestEntityTooLargeError: require('./custom/request-entity-too-large'),
    TokenRevocationError: require('./custom/token-revocation'),
    TooManyRequestsError: require('./custom/too-many-requests'),
    UnauthorizedError: require('./custom/unauthorized'),
    ValidationError: require('./custom/validation'),
    VersionMismatchError: require('./custom/version-mismatch'),
    UnsupportedMediaTypeError: require('./custom/unsupported-media-type')
};

/**
 * serialize internal error instance to JSONAPI error format
 */
exports.serialize = function serialize(err) {
    return {
        errors: [
            {
                id: err.id,
                status: err.statusCode,
                code: err.code || err.errorType,
                title: err.name,
                detail: err.message,
                meta: {
                    context: err.context,
                    help: err.help,
                    errorDetails: err.errorDetails,
                    level: err.level,
                    errorType: err.errorType
                }
            }
        ]
    };
};

/**
 * deserialize from JSONAPI error format to internal error instance
 */
exports.deserialize = function deserialize(obj) {
    var error = obj.errors[0];

    return new this[error.title]({
        id: error.id,
        message: error.detail,
        statusCode: error.status,
        code: error.code,
        level: error.meta.level,
        help: error.meta.help,
        context: error.meta.context
    });
};
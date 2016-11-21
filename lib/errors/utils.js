/**
 * serialize internal error instance to JSONAPI error format
 *
 * JSONAPI example HTTP request
 *
 * body: {
 *   data: {
 *     type: 'users',
 *     attributes: {
 *       email: 'email@example.com'
 *     }
 *   }
 * }
 *
 * JSONAPI errors format
 *
 * source: {
 *   parameter: URL query parameter (no support yet)
 *   pointer: HTTP body attribute
 * }
 *
 * http://jsonapi.org/format/#errors
 */
exports.serialize = function serialize(err) {
    var jsonApiFormat = {
        errors: [
            {
                id: err.id,
                status: err.statusCode,
                code: err.code || err.errorType,
                title: err.name,
                detail: err.message,
                source: {},
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

    if (err.property) {
        jsonApiFormat.errors[0].source.pointer = '/data/attributes/' + err.property;
    }

    return jsonApiFormat;
};

/**
 * deserialize from JSONAPI error format to internal error instance
 */
exports.deserialize = function deserialize(obj) {
    var jsonApiFormat = obj.errors[0],
        internalError = new this[jsonApiFormat.title]({
            id: jsonApiFormat.id,
            message: jsonApiFormat.detail,
            statusCode: jsonApiFormat.status,
            code: jsonApiFormat.code,
            level: jsonApiFormat.meta.level,
            help: jsonApiFormat.meta.help,
            context: jsonApiFormat.meta.context
        });

    if (jsonApiFormat.source.pointer) {
        internalError.property = jsonApiFormat.source.pointer.split('/')[3];
    }

    return internalError;
};
var GhostLogger = require('./GhostLogger');

/**
 * @TODO:
 * - explain the options
 */
module.exports = function createNewInstance(options) {
    options = options || {};

    var adapter = new GhostLogger({
        name: options.name,
        domain: options.domain,
        env: options.env,
        mode: options.mode,
        level: options.level,
        logBody: options.logBody,
        transports: options.transports,
        rotation: options.rotation,
        path: options.path,
        loggly: options.loggly,
        gelf: options.gelf
    });

    return adapter;
};

module.exports.GhostLogger = GhostLogger;

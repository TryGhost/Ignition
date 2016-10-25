var GhostLogger = require('./GhostLogger');

/**
 * @TODO:
 * - explain the options
 */
module.exports = function createNewInstance(options) {
    options = options || {};

    var adapter = new GhostLogger({
        domain: options.domain,
        env: options.env,
        mode: options.mode,
        level: options.level,
        transports: options.transports,
        rotation: options.rotation,
        path: options.path
    });

    return adapter;
};

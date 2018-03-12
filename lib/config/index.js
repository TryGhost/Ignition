var nconf = require('nconf');
var fs = require('fs');
var path = require('path');
var utils = require('../utils');
var config;

var setupConfig = function setupConfig() {
    var env = require('./env');
    var defaults = {};
    var parentPath = utils.getCWDRoot();

    config = new nconf.Provider();

    if (parentPath && fs.existsSync(path.join(parentPath, 'config.example.json'))) {
        defaults = require(path.join(parentPath, 'config.example.json'));
    }

    config.argv()
        .env()
        .file({
            file: path.join(parentPath, 'config.' + env + '.json')
        });

    config.set('env', env);

    config.defaults(defaults);
};

/**
 * The config object is cached, once it has been setup with the parent
 * @param {boolean} noCache - used for tests only, to reinit the cache on every call
 */
module.exports = function initConfig(noCache) {
    if (!config || noCache) {
         setupConfig();
    }

    return config;
};

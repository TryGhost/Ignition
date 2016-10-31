var nconf = require('nconf');
var fs = require('fs');
var path = require('path');
var debug = require('debug')('ignition:config');
var config;

var setupConfig = function setupConfig() {
    var env = require('./env');
    var defaults = {};
    var parentPath = process.cwd();

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
 */
module.exports = function initConfig() {
    if (!config) {
         setupConfig();
    }

    return config;
};

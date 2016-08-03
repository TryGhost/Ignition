var config = require('./config');
var alias = config.get('alias') || process.env.npm_package_name;
var debug = require('debug');

module.exports = function initDebug(name) {
    return debug(alias + ':' + name);
}
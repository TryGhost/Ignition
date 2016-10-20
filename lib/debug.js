var path = process.cwd().split('/');
var alias = process.env.npm_package_alias || process.env.npm_package_name || path[path.length - 1];
var debug = require('debug');

module.exports = function initDebug(name) {
    return debug(alias + ':' + name);
}
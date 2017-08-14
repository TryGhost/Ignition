var utils = require('./utils');
var debug = require('debug');

module.exports = function initDebug(name) {
    var parentPath = utils.getParentPath();
    var alias, pkg;

    try {
        pkg = require(parentPath + '/package.json');

        if (pkg.alias) {
            alias = pkg.alias;
        } else {
            alias = pkg.name;
        }

    } catch (err) {
        alias = 'undefined';
    }

    return debug(alias + ':' + name);
};

module.exports._base = debug;

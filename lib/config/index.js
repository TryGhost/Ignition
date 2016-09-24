var nconf = require('nconf');
var fs = require('fs');
var path = require('path');
var findRoot = require('find-root');
var defaults = {};
var getParentPath = function (parent) {
        if (!parent  || !parent.filename) {
            return null;
        }

        if (parent.filename.match(/ghost-ignition/gi)) {
            return getParentPath(parent.parent);
        }

        // finds the root with package.json based on a path
        return findRoot(parent.filename);
    };
var parentPath = getParentPath(module.parent);
var env = require('./env');

if (parentPath && fs.existsSync(path.join(parentPath, 'config.example.json'))) {
    defaults = require(path.join(parentPath, 'config.example.json'));
}

nconf.set('NODE_ENV', env);

nconf.argv()
    .env()
    .file({
        file: path.join(parentPath, 'config.' + env + '.json')
    });

nconf.defaults(defaults);

// @TODO: this file gets cached after the first require, we need to redesign how we load the config
// @TODO: for example: require('ghost-ignition').config()
module.exports = nconf;

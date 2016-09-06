var nconf = require('nconf'),
    fs = require('fs'),
    path = require('path'),
    findRoot = require('find-root'),
    defaults = {},
    getParentPath = function (parent) {
        if (!parent  || !parent.filename) {
            return null;
        }

        if (parent.filename.match(/ghost-ignition/gi)) {
            return getParentPath(parent.parent);
        }

        // finds the root with package.json based on a path
        return findRoot(parent.filename);
    },
    parentPath = getParentPath(module.parent);

if (parentPath && fs.existsSync(path.join(parentPath, 'config.example.json'))) {
    defaults = require(path.join(parentPath, 'config.example.json'));
}

nconf.set('NODE_ENV', process.env.NODE_ENV);

nconf.argv()
    .env()
    .file({
        file: path.join(parentPath, 'config.' + process.env.NODE_ENV + '.json')
    });

nconf.defaults(defaults);

// @TODO: this file gets cached after the first require, we need to redesign how we load the config
// @TODO: for example: require('ghost-ignition').config()
module.exports = nconf;

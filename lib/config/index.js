var nconf = require('nconf'),
    path = require('path');

var defaults = require(path.join(process.cwd(), 'config.example'));

function getConfigFileName() {
    return (process.env.NODE_ENV) ?
        'config.' + process.env.NODE_ENV + '.json' :
        'config.json';
}

nconf.set('NODE_ENV', process.env.NODE_ENV);

nconf.argv()
    .env()
    .file({
        file: path.join(process.cwd(), getConfigFileName())
    });

nconf.defaults(defaults);
module.exports = nconf;

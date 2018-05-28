const debug = require('./debug')('server');
const http = require('http');

let server;
let port;

/**
 * Get port from nconf
 */

const start = function start(app) {
    /**
     * Create HTTP server.
     */

    const config = require('./config')();
    port = normalizePort(config.get('port'));
    server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    app.set('port', port);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    return server;
};

/**
 * Stop HTTP server.
 */
const stop = function stop(done) {
    try {
        server.close(done);
    } catch(e) {
        /*jshint unused:false*/
    }
};

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Server ready');
    console.log(`Listening on ${bind} \n`);
}


module.exports.start = start;
module.exports.stop = stop;

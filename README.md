# Ignition 
[![Build Status](https://travis-ci.org/TryGhost/Ignition.svg?branch=master)](https://travis-ci.org/TryGhost/Ignition)

Basic configuration and tooling shared across applications


## Logging
```
var logging = require('ghost-ignition').logging({
    domain: 'example.com,
    env: 'production',
    mode: 'long',
    level: 'info',
    transports: ['file'],
    rotation: {enabled: true, period: '1d', count: 10},
    path: '/var/log'
});

mode         : long|short (default is `short`) - defines the output volume (helpful when logging requests)
level        : info|error|debug (default is `info`)
transports   : stdout|file|stderr (default is `['stdout']`)
path         : is used when file transport is enabled (default is `process.cwd()`)

logging.info({req: req, res: res});
logging.info('Info');
logging.error(new Error());
logging.warn('this', 'is', 'a', 'warning');
logging.debug('this is a debug mode');
```

### env parameter

Each config option, can be passed as an environment variable:
E.g. `LEVEL=error` or `MODE=long`.

There is also a special env var

`LOIN=true` 

Which sets the LEVEL to info and the MODE to long, for maximum output.

### Logging into file
We log JSON format into file. This is very easy to forward and easy to interprete.
By default we create two log files:
- errors log entries: contains only errors
- all log entries: contains everything

You can easily make the log files readable by calling:
`cat your.log | bunyan`

### Loggly Stream
You can send your logs to loggly by configuring the logger like this:

```
var logging = require('ghost-ignition').logging({
    domain: 'example.com,
    env: 'production',
    mode: 'long',
    level: 'info',
    transports: ['file', 'loggly'],
    rotation: {enabled: true, period: '1d', count: 10},
    path: '/var/log',
    loggly: {
      token: 'your-token',
      subdomain: 'your-subdomain',
      match: 'regex as string to match specific properties only certain log entries'
    }
});

Example for match:
match: 'level:critical'
match: 'statusCode:500|statusCode:403'
```

### Utils

```
var errors = require('ghost-ignition');

// you can pass any error and ignition will tell you if this is a custom ignition error
errors.utils.isIgnitionError(err);

// serialize an error to a specific format
errors.utils.serialize(err, {format: 'jsonapi|oauth'});

// deserialize specific format to error instance
errors.utils.deserialize(err);
```

# Copyright & License

Copyright (c) 2016-2017 Ghost Foundation - Released under the [MIT license](LICENSE).

# Ignition
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

**mode**       : long|short (default is `short`) - defines the output volume (helpful when logging requests)
**level**      : info|error|debug (default is `info`)
**transports** : stdout|file (default is `['stdout']`
**path**       : is used when file transport is enabled (default is `process.cwd()`)

logging.info({req: req, res: res});
logging.info('Info');
logging.error(new Error());
logging.warn('this', 'is', 'a', 'warning');
logging.debug('this is a debug mode');
```

### Logging into file
We log JSON format into file. This is very easy to forward and easy to interprete.
By default we create two log files:
- errors log entries: contains only errors
- all log entries: contains everything

You can easily make the log files readable by calling:
`cat your.log | bunyan`


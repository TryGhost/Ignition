var PrettyStream = require('../lib/logging/PrettyStream');
var GhostLogger = require('../lib/logging/GhostLogger');
var Writable = require('stream').Writable;
var includes = require('lodash/includes');
var errors = require('../lib/errors');
var sinon = require('sinon');
var should = require('should');
var Bunyan2Loggly = require('bunyan-loggly');
var GelfStream = require('gelf-stream').GelfStream;
var sandbox = sinon.sandbox.create();

describe('Logging', function () {
    afterEach(function () {
        sandbox.restore();
    });

    // in Bunyan 1.8.3 they have changed this behaviour
    // they are trying to find the err.message attribute and forward this as msg property
    // our PrettyStream implementation can't handle this case
    it('ensure stdout write properties', function (done) {
        sandbox.stub(PrettyStream.prototype, 'write', function (data) {
            should.exist(data.req);
            should.exist(data.req.headers);
            should.not.exist(data.req.body);
            should.exist(data.res);
            should.exist(data.err);
            data.name.should.eql('testLogging');
            data.msg.should.eql('message');
            done();
        });

        var ghostLogger = new GhostLogger({name: 'testLogging'});
        ghostLogger.info({err: new Error('message'), req: {body: {}, headers: {}}, res: {headers: {}}});
    });

    it('redact sensitive data with request body', function (done) {
        sandbox.stub(PrettyStream.prototype, 'write', function (data) {
            should.exist(data.req.body.password);
            data.req.body.password.should.eql('**REDACTED**');
            should.exist(data.req.body.data.attributes.pin);
            data.req.body.data.attributes.pin.should.eql('**REDACTED**');
            should.exist(data.req.body.data.attributes.test);
            should.exist(data.err);
            should.exist(data.err.errorDetails);
            done();
        });

        var ghostLogger = new GhostLogger({logBody: true});

        ghostLogger.error({
            err: new errors.IncorrectUsageError({message: 'Hallo', errorDetails: []}),
            req: {
                body: {
                    password: '12345678',
                    data: {
                        attributes: {
                            pin: '1234',
                            test: 'ja'
                        }
                    }
                },
                headers: {
                    authorization: 'secret',
                    Connection: 'keep-alive'
                }
            },
            res: {headers: {}}
        });
    });

    it('gelf writes a log message', function (done) {
        sandbox.stub(GelfStream.prototype, '_write', function (data) {
            should.exist(data.err);
            done();
        });

        var ghostLogger = new GhostLogger({
            transports: ['gelf'],
            gelf: {
                host: 'localhost',
                port: 12201
            }
        });

        ghostLogger.error(new errors.NotFoundError());
        GelfStream.prototype._write.called.should.eql(true);
    });

    it('gelf does not write a log message', function () {
        sandbox.spy(GelfStream.prototype, '_write');

        var ghostLogger = new GhostLogger({
            transports: ['gelf'],
            level: 'warn',
            gelf: {
                host: 'localhost',
                port: 12201
            }
        });

        ghostLogger.info('testing');
        GelfStream.prototype._write.called.should.eql(false);
    });

    it('loggly does only stream certain errors', function (done) {
        sandbox.stub(Bunyan2Loggly.prototype, 'write', function (data) {
            should.exist(data.err);
            done();
        });

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: 'level:critical'
            }
        });

        ghostLogger.error(new errors.InternalServerError());
        Bunyan2Loggly.prototype.write.called.should.eql(true);
    });

    it('loggly does only stream certain errors', function () {
        sandbox.spy(Bunyan2Loggly.prototype, 'write');

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: 'level:critical'
            }
        });

        ghostLogger.error(new errors.NotFoundError());
        Bunyan2Loggly.prototype.write.called.should.eql(false);
    });

    it('loggly does only stream certain errors', function () {
        sandbox.spy(Bunyan2Loggly.prototype, 'write');

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: '^((?!statusCode:4\\d{2}).)*$'
            }
        });

        ghostLogger.error(new errors.NotFoundError());
        Bunyan2Loggly.prototype.write.called.should.eql(false);
    });

    it('loggly does only stream certain errors', function () {
        sandbox.spy(Bunyan2Loggly.prototype, 'write');

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: '^((?!statusCode:4\\d{2}).)*$'
            }
        });

        ghostLogger.error(new errors.NoPermissionError());
        Bunyan2Loggly.prototype.write.called.should.eql(false);
    });

    it('loggly does only stream certain errors', function () {
        sandbox.spy(Bunyan2Loggly.prototype, 'write');

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: '^((?!statusCode:4\\d{2}).)*$'
            }
        });

        ghostLogger.error(new errors.InternalServerError());
        Bunyan2Loggly.prototype.write.called.should.eql(true);
    });

    it('loggly does only stream certain errors', function (done) {
        sandbox.stub(Bunyan2Loggly.prototype, 'write', function (data) {
            should.exist(data.err);
            done();
        });

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: 'level:normal'
            }
        });

        ghostLogger.error(new errors.NotFoundError());
        Bunyan2Loggly.prototype.write.called.should.eql(true);
    });

    it('loggly does only stream certain errors', function (done) {
        sandbox.stub(Bunyan2Loggly.prototype, 'write', function (data) {
            should.exist(data.err);
            done();
        });

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: 'level:critical|statusCode:404'
            }
        });

        ghostLogger.error(new errors.NotFoundError());
        Bunyan2Loggly.prototype.write.called.should.eql(true);
    });

    it('loggly does only stream certain errors', function (done) {
        sandbox.stub(Bunyan2Loggly.prototype, 'write', function (data) {
            should.exist(data.err);
            should.exist(data.req);
            should.exist(data.res);
            done();
        });

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid',
                match: 'statusCode:404'
            }
        });

        ghostLogger.error({
            err: new errors.NotFoundError(),
            req: {body: {password: '12345678', data: {attributes: {pin: '1234', test: 'ja'}}}},
            res: {headers: {}}
        });
        Bunyan2Loggly.prototype.write.called.should.eql(true);
    });

    it('loggly does only stream certain errors: match is not defined -> log everything', function (done) {
        sandbox.stub(Bunyan2Loggly.prototype, 'write', function (data) {
            should.exist(data.err);
            done();
        });

        var ghostLogger = new GhostLogger({
            transports: ['loggly'],
            loggly: {
                token: 'invalid',
                subdomain: 'invalid'
            }
        });

        ghostLogger.error(new errors.NotFoundError());
        Bunyan2Loggly.prototype.write.called.should.eql(true);
    });

    it('automatically adds stdout to transports if stderr transport is configured and stdout isn\'t', function () {
        var ghostLogger = new GhostLogger({
            transports: ['stderr']
        });

        should.equal(includes(ghostLogger.transports, 'stderr'), true, 'stderr transport should exist');
        should.equal(includes(ghostLogger.transports, 'stdout'), true, 'stdout transport should exist');
    });

    it('logs errors only to stderr if both stdout and stderr transports are defined', function () {
        var stderr = sandbox.spy(process.stderr, 'write');
        var stdout = sandbox.spy(process.stdout, 'write');

        var ghostLogger = new GhostLogger({
            transports: ['stdout', 'stderr']
        });

        ghostLogger.error('some error');
        stderr.calledOnce.should.be.true();
        stdout.called.should.be.false('stdout should not be written to');
    });

    describe('serialization', function () {
        it('serializes error into correct object', function (done) {
            const err = new errors.NotFoundError();

            sandbox.stub(Bunyan2Loggly.prototype, 'write', function (data) {
                should.exist(data.err);
                data.err.id.should.eql(err.id)
                data.err.domain.should.eql('localhost');
                should.equal(data.err.code, null);
                data.err.name.should.eql(err.errorType);
                should.equal(data.err.statusCode, err.statusCode);
                data.err.level.should.eql(err.level);
                data.err.message.should.eql(err.message);
                should.equal(data.err.context, undefined);
                should.equal(data.err.help, undefined);
                should.exist(data.err.stack);
                should.equal(data.err.hideStack, undefined);
                should.equal(data.err.errorDetails, undefined);
                done();
            });

            const ghostLogger = new GhostLogger({
                transports: ['loggly'],
                loggly: {
                    token: 'invalid',
                    subdomain: 'invalid'
                }
            });
            ghostLogger.error({
                err,
            });

            Bunyan2Loggly.prototype.write.called.should.eql(true);
        });

        it('stringifies meta properties', function (done) {
            sandbox.stub(Bunyan2Loggly.prototype, 'write', function (data) {
                should.exist(data.err);
                data.err.context.should.eql("{\"a\":\"b\"}");
                data.err.errorDetails.should.eql("{\"c\":\"d\"}");
                data.err.help.should.eql("{\"b\":\"a\"}");
                done();
            });

            const ghostLogger = new GhostLogger({
                transports: ['loggly'],
                loggly: {
                    token: 'invalid',
                    subdomain: 'invalid'
                }
            });
            ghostLogger.error({
                err: new errors.NotFoundError({
                    context: {
                        a: 'b'
                    },
                    errorDetails: {
                        c: 'd'
                    },
                    help: {
                        b: 'a'
                    }
                }),
            });

            Bunyan2Loggly.prototype.write.called.should.eql(true);
        });
    })

    describe('PrettyStream', function () {
        describe('short mode', function () {
            it('data.msg', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'short'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[36mINFO\u001b[39m Ghost starts now.\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 30,
                    msg: 'Ghost starts now.'
                }));
            });

            it('data.err', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'short'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[31mERROR\u001b[39m\n\u001b[31m\n\u001b[31mHey Jude!\u001b[39m\n\n\u001b[1m\u001b[37mError Code: \u001b[39m\u001b[22m\n    \u001b[90mHEY_JUDE\u001b[39m\n\n\u001b[90m----------------------------------------\u001b[39m\n\n\u001b[90mstack\u001b[39m\n\u001b[39m\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 50,
                    msg: 'message',
                    err: {
                        message: 'Hey Jude!',
                        stack: 'stack',
                        code: 'HEY_JUDE'
                    }
                }));
            });

            it('data.req && data.res', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'short'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[36mINFO\u001b[39m "GET /test" \u001b[32m200\u001b[39m 39ms\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 30,
                    req: {
                        originalUrl: '/test',
                        method: 'GET',
                        body: {
                            a: 'b'
                        }
                    },
                    res: {
                        statusCode: 200,
                        responseTime: '39ms'
                    }
                }));
            });

            it('data.req && data.res && data.err', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'short'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[31mERROR\u001b[39m "GET /test" \u001b[33m400\u001b[39m 39ms\n\u001b[31m\n\u001b[31mmessage\u001b[39m\n\n\u001b[90m----------------------------------------\u001b[39m\n\n\u001b[90mstack\u001b[39m\n\u001b[39m\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 50,
                    req: {
                        originalUrl: '/test',
                        method: 'GET',
                        body: {
                            a: 'b'
                        }
                    },
                    res: {
                        statusCode: 400,
                        responseTime: '39ms'
                    },
                    err: {
                        message: 'message',
                        stack: 'stack'
                    }
                }));
            });
        });

        describe('long mode', function () {
            it('data.msg', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'long'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[36mINFO\u001b[39m Ghost starts now.\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 30,
                    msg: 'Ghost starts now.'
                }));
            });

            it('data.err', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'long'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[31mERROR\u001b[39m\n\u001b[31m\n\u001b[31mHey Jude!\u001b[39m\n\n\u001b[90m----------------------------------------\u001b[39m\n\n\u001b[90mstack\u001b[39m\n\u001b[39m\n\u001b[90m\u001b[39m\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 50,
                    err: {
                        message: 'Hey Jude!',
                        stack: 'stack'
                    }
                }));
            });

            it('data.req && data.res', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'long'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[36mINFO\u001b[39m "GET /test" \u001b[32m200\u001b[39m 39ms\n\u001b[90m\n\u001b[33mREQ\u001b[39m\n\u001b[32mip: \u001b[39m         127.0.01\n\u001b[32moriginalUrl: \u001b[39m/test\n\u001b[32mmethod: \u001b[39m     GET\n\u001b[32mbody: \u001b[39m\n  \u001b[32ma: \u001b[39mb\n\n\u001b[33mRES\u001b[39m\n\u001b[32mresponseTime: \u001b[39m39ms\n\u001b[39m\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 30,
                    req: {
                        ip: '127.0.01',
                        originalUrl: '/test',
                        method: 'GET',
                        body: {
                            a: 'b'
                        }
                    },
                    res: {
                        statusCode: 200,
                        responseTime: '39ms'
                    }
                }));
            });

            it('data.req && data.res && data.err', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'long'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[31mERROR\u001b[39m "GET /test" \u001b[33m400\u001b[39m 39ms\n\u001b[31m\n\u001b[31mHey Jude!\u001b[39m\n\n\u001b[90m----------------------------------------\u001b[39m\n\n\u001b[90mstack\u001b[39m\n\u001b[39m\n\u001b[90m\n\u001b[33mREQ\u001b[39m\n\u001b[32moriginalUrl: \u001b[39m/test\n\u001b[32mmethod: \u001b[39m     GET\n\u001b[32mbody: \u001b[39m\n  \u001b[32ma: \u001b[39mb\n\n\u001b[33mRES\u001b[39m\n\u001b[32mresponseTime: \u001b[39m39ms\n\u001b[39m\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 50,
                    req: {
                        originalUrl: '/test',
                        method: 'GET',
                        body: {
                            a: 'b'
                        }
                    },
                    res: {
                        statusCode: 400,
                        responseTime: '39ms'
                    },
                    err: {
                        message: 'Hey Jude!',
                        stack: 'stack'
                    }
                }));
            });

            it('data.err contains error details && meta fields', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'long'});
                var writeStream = new Writable();

                writeStream._write = function (data) {
                    data = data.toString();
                    data.should.eql('[2016-07-01 00:00:00] \u001b[31mERROR\u001b[39m\n\u001b[31m\n\u001b[31mType: ValidationError\u001b[39m\n\u001b[31mHey Jude!\u001b[39m\n\n\u001b[37m{"a":"b"}\u001b[39m\n\u001b[33mCheck documentation at https://docs.ghost.org/\u001b[39m\n\n\u001b[1m\u001b[37mError ID:\u001b[39m\u001b[22m\n    \u001b[90me8546680-401f-11e9-99a7-ed7d6251b35c\u001b[39m\n\n\u001b[1m\u001b[37mDetails:\u001b[39m\u001b[22m\n\u001b[90m    level:    error\n    rule:     Templates must contain valid Handlebars.\n    failures: \n      - \n        ref:     default.hbs\n        message: Missing helper: "image"\n    code:     GS005-TPL-ERR\u001b[39m\n\n\u001b[90m----------------------------------------\u001b[39m\n\n\u001b[90mstack\u001b[39m\n\u001b[39m\n\u001b[90m\u001b[39m\n');
                    done();
                };

                ghostPrettyStream.pipe(writeStream);

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 50,
                    err: {
                        message: 'Hey Jude!',
                        stack: 'stack',
                        errorType: 'ValidationError',
                        id: 'e8546680-401f-11e9-99a7-ed7d6251b35c',
                        context: JSON.stringify({a: 'b'}),
                        help: 'Check documentation at https://docs.ghost.org/',
                        errorDetails: JSON.stringify([{
                            level: 'error',
                            rule: 'Templates must contain valid Handlebars.',
                            failures: [{ref: 'default.hbs', message: 'Missing helper: "image"'}],
                            code: 'GS005-TPL-ERR'
                        }])
                    }
                }));
            });
        });
    });
});

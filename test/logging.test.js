var PrettyStream = require('../lib/logging/PrettyStream');
var GhostLogger = require('../lib/logging/GhostLogger');
var errors = require('../lib/errors');
var sinon = require('sinon');
var should = require('should');
var Bunyan2Loggly = require('bunyan-loggly');
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
            should.exist(data.res);
            should.exist(data.err);
            data.msg.should.eql('');
            done();
        });

        var ghostLogger = new GhostLogger();
        ghostLogger.info({err: new Error('message'), req: {body: {}}, res: {headers: {}}});
    });

    it('remove sensitive data', function (done) {
        sandbox.stub(PrettyStream.prototype, 'write', function (data) {
            should.not.exist(data.req.body.password);
            should.not.exist(data.req.body.data.attributes.pin);
            should.exist(data.req.body.data.attributes.test);
            done();
        });

        var ghostLogger = new GhostLogger();

        ghostLogger.error({
            err: new Error('message'),
            req: {body: {password: '12345678', data: {attributes: {pin: '1234', test: 'ja'}}}},
            res: {headers: {}}
        });
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

    describe('PrettyStream', function () {
        describe('short mode', function () {
            it('data.msg', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'short'});

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('[2016-07-01 00:00:00] \u001b[36mINFO\u001b[39m Ghost starts now.\n');
                    done();
                };

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 30,
                    msg: 'Ghost starts now.'
                }));
            });

            it('data.err', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'short'});

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('[2016-07-01 00:00:00] \u001b[31mERROR\u001b[39m\n\u001b[31m\n\u001b[31mHey Jude!\u001b[39m\n\u001b[37mstack\u001b[39m\n\u001b[39m\n');
                    done();
                };

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
                var ghostPrettyStream = new PrettyStream({mode: 'short'});

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('\u001b[36mINFO\u001b[39m [2016-07-01 00:00:00] "GET /test" 200 39ms\n');
                    done();
                };

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

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('\u001b[31mERROR\u001b[39m [2016-07-01 00:00:00] "GET /test" 400 39ms\n\u001b[31m\n\u001b[31mmessage\u001b[39m\n\u001b[37mstack\u001b[39m\n\u001b[39m\n');
                    done();
                };

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

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('[2016-07-01 00:00:00] \u001b[36mINFO\u001b[39m Ghost starts now.\n');
                    done();
                };

                ghostPrettyStream.write(JSON.stringify({
                    time: '2016-07-01 00:00:00',
                    level: 30,
                    msg: 'Ghost starts now.'
                }));
            });

            it('data.err', function (done) {
                var ghostPrettyStream = new PrettyStream({mode: 'long'});

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('[2016-07-01 00:00:00] \u001b[31mERROR\u001b[39m\n\u001b[31m\n\u001b[31mHey Jude!\u001b[39m\n\u001b[37mstack\u001b[39m\n\u001b[39m\n\u001b[90m\u001b[39m\n');
                    done();
                };

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

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('\u001b[36mINFO\u001b[39m [2016-07-01 00:00:00] "GET /test" 200 39ms\n\u001b[90m\n\u001b[33mREQ\u001b[39m\n\u001b[32mip: \u001b[39m         127.0.01\n\u001b[32moriginalUrl: \u001b[39m/test\n\u001b[32mmethod: \u001b[39m     GET\n\u001b[32mbody: \u001b[39m\n  \u001b[32ma: \u001b[39mb\n\n\u001b[33mRES\u001b[39m\n\u001b[32mresponseTime: \u001b[39m39ms\n\u001b[39m\n');
                    done();
                };

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

                ghostPrettyStream.emit = function (eventName, data) {
                    data.should.eql('\u001b[31mERROR\u001b[39m [2016-07-01 00:00:00] "GET /test" 400 39ms\n\u001b[31m\n\u001b[31mHey Jude!\u001b[39m\n\u001b[37mstack\u001b[39m\n\u001b[39m\n\u001b[90m\n\u001b[33mREQ\u001b[39m\n\u001b[32moriginalUrl: \u001b[39m/test\n\u001b[32mmethod: \u001b[39m     GET\n\u001b[32mbody: \u001b[39m\n  \u001b[32ma: \u001b[39mb\n\n\u001b[33mRES\u001b[39m\n\u001b[32mresponseTime: \u001b[39m39ms\n\u001b[39m\n');
                    done();
                };

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
        });
    });
});
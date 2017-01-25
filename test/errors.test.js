// Test requirements
var expect = require('chai').expect;
var should = require('should');
var _ = require('lodash');
require('./assertions');

// What we're testing
var errors = require('../lib/errors');
var util = require('util');

describe('Errors Public API', function () {
    it('is instance of error', function () {
        (new errors.IgnitionError() instanceof Error).should.eql(true);
    });

    // @TODO: re-add the missing once
    it('has custom error classes', function () {
        expect(errors).to.have.ownProperty('BadRequestError');
        expect(errors).to.have.ownProperty('MaintenanceError');
        expect(errors).to.have.ownProperty('MethodNotAllowedError');
        expect(errors).to.have.ownProperty('NoPermissionError');
        expect(errors).to.have.ownProperty('NotFoundError');
        expect(errors).to.have.ownProperty('RequestEntityTooLargeError');
        expect(errors).to.have.ownProperty('TokenRevocationError');
        expect(errors).to.have.ownProperty('TooManyRequestsError');
        expect(errors).to.have.ownProperty('UnauthorizedError');
        expect(errors).to.have.ownProperty('ValidationError');
        expect(errors).to.have.ownProperty('VersionMismatchError');
        expect(errors).to.have.ownProperty('UnsupportedMediaTypeError');
    });

    it('simulate ignition usage', function () {
        // imagine this here is an new JS file in Ghost!
        function GhostError(options) {
            this.property = options.property;
            this.value = options.value;

            errors.IgnitionError.call(this, options);
        }

        var ghostErrors = {
            CustomGhostError: function CustomGhostError(options) {
                GhostError.call(this, _.merge({
                    statusCode: 500,
                    errorType: 'CustomGhostError'
                }, options));
            }
        };

        util.inherits(GhostError, errors.IgnitionError);
        _.each(ghostErrors, function (error) {
            util.inherits(error, GhostError);
        });

        // #### testing
        var ghostError = new GhostError({
            property: 'name',
            value: 'Kate'
        });

        should.exist(ghostError.property);
        should.exist(ghostError.value);
        should.exist(ghostError.statusCode);

        var toExport = _.merge(ghostErrors, errors);

        (new toExport.CustomGhostError() instanceof Error).should.eql(true);
        (new toExport.CustomGhostError() instanceof GhostError).should.eql(true);
        (new toExport.CustomGhostError() instanceof errors.IgnitionError).should.eql(true);

        (new toExport.NoPermissionError() instanceof Error).should.eql(true);
        (new toExport.NoPermissionError() instanceof GhostError).should.eql(false);
        (new toExport.NoPermissionError() instanceof errors.IgnitionError).should.eql(true);

        should.exist(toExport.CustomGhostError);
        should.exist(toExport.NoPermissionError);

        should.not.exist(errors.CustomGhostError);
    });

    it('test default message', function () {
        var err = new errors.BadRequestError();
        err.message.should.eql('The request could not be understood.');

        err = new errors.BadRequestError({message: 'this is custom'});
        err.message.should.eql('this is custom');
    });

    it('internal server error', function () {
        var err = new errors.InternalServerError();
        err.level.should.eql('critical');
    });

    it('test property', function () {
        var err = new errors.BadRequestError({property: 'email'});
        err.property.should.eql('email');
    });

    it('test err as string', function () {
        var err = new errors.BadRequestError({err: 'db error'});
        err.stack.should.containEql('db error');
    });

    it('serialize/deserialize error', function () {
        var err = new errors.BadRequestError({
            help: 'do you need help?',
            context: 'i can\'t help',
            property: 'email'
        });

        var serialized = errors.utils.serialize(err);

        serialized.should.be.a.JSONErrorResponse({
            status: 400,
            code: 'BadRequestError',
            title: 'BadRequestError',
            detail: 'The request could not be understood.',
            source: {
                pointer: '/data/attributes/email'
            },
            meta: {
                level: 'normal',
                errorType: 'BadRequestError'
            }
        });

        var deserialized = errors.utils.deserialize(serialized);
        (deserialized instanceof errors.IgnitionError).should.eql(true);
        (deserialized instanceof Error).should.eql(true);

        deserialized.id.should.eql(serialized.errors[0].id);
        deserialized.message.should.eql(serialized.errors[0].detail);
        deserialized.name.should.eql(serialized.errors[0].title);
        deserialized.statusCode.should.eql(serialized.errors[0].status);
        deserialized.level.should.eql(serialized.errors[0].meta.level);
        deserialized.help.should.eql(serialized.errors[0].meta.help);
        deserialized.context.should.eql(serialized.errors[0].meta.context);
        deserialized.property.should.eql('email');

        err = new errors.BadRequestError();
        serialized = errors.utils.serialize(err);

        serialized.should.be.a.JSONErrorResponse({
            status: 400,
            code: 'BadRequestError',
            title: 'BadRequestError',
            detail: 'The request could not be understood.',
            meta: {
                level: 'normal',
                errorType: 'BadRequestError'
            }
        });

        should.not.exist(serialized.errors[0].error);
        should.not.exist(serialized.errors[0].error_description);
    });

    it('oauth serialize', function () {
        var err = new errors.NoPermissionError({
            message: 'Permissions you need to have.'
        });

        var serialized = errors.utils.serialize(err, {format: 'oauth'});

        serialized.error.should.eql('access_denied');
        serialized.error_description.should.eql('Permissions you need to have.');
        serialized.status.should.eql(403);
        serialized.title.should.eql('NoPermissionError');
        serialized.meta.level.should.eql('normal');

        should.not.exist(serialized.message);
        should.not.exist(serialized.detail);
        should.not.exist(serialized.code);

        var deserialized = errors.utils.deserialize(serialized, {});

        (deserialized instanceof errors.IgnitionError).should.eql(true);
        (deserialized instanceof errors.NoPermissionError).should.eql(true);
        (deserialized instanceof Error).should.eql(true);

        deserialized.id.should.eql(serialized.id);
        deserialized.message.should.eql(serialized.error_description);
        deserialized.name.should.eql(serialized.title);
        deserialized.statusCode.should.eql(serialized.status);
        deserialized.level.should.eql(serialized.meta.level);
    });

    it('[failure] deserialize jsonapi, but obj is empty', function () {
        var deserialized = errors.utils.deserialize({});
        (deserialized instanceof errors.IgnitionError).should.eql(true);
        (deserialized instanceof errors.InternalServerError).should.eql(true);
        (deserialized instanceof Error).should.eql(true);
    });

    it('[failure] deserialize oauth, but obj is empty', function () {
        var deserialized = errors.utils.deserialize({});
        (deserialized instanceof errors.IgnitionError).should.eql(true);
        (deserialized instanceof errors.InternalServerError).should.eql(true);
        (deserialized instanceof Error).should.eql(true);
    });

    it('[failure] serialize oauth, but obj is empty', function () {
        var serialized = errors.utils.serialize({}, {format: 'oauth'});
        serialized.error.should.eql('server_error');
    });

    describe('isIgnitionError', function () {
        it('1', function () {
            var isIgnitionError = errors.utils.isIgnitionError(new Error());
            isIgnitionError.should.eql(false);
        });

        it('2', function () {
            var isIgnitionError = errors.utils.isIgnitionError(new errors.NotFoundError());
            isIgnitionError.should.eql(true);
        });

        it('3', function () {
            var err = new errors.NotFoundError();
            err.constructor.super_ = {};
            err.constructor.super_.name = 'GhostError';
            err.constructor.super_.super_ = {};
            err.constructor.super_.super_.name = 'IgnitionError';

            var isIgnitionError = errors.utils.isIgnitionError(err);
            isIgnitionError.should.eql(true);
        });

        it('4', function () {
            var err = new errors.NotFoundError();
            err.constructor.super_ = {};
            err.constructor.super_.name = 'GhostError';
            err.constructor.super_.super_ = {};
            err.constructor.super_.super_.name = 'NoIgnitionError';

            var isIgnitionError = errors.utils.isIgnitionError(err);
            isIgnitionError.should.eql(false);
        });
    });
});
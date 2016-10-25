// Test requirements
var expect = require('chai').expect;
var should = require('should');
var _ = require('lodash');

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
});
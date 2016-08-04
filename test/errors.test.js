// Test requirements
var expect = require('chai').expect;

// What we're testing
var errors = require('../lib/errors');

describe('Errors Public API', function () {
   it('has create method', function () {
       expect(errors).to.have.ownProperty('create');
   });

    it('has custom error classes', function () {
        expect(errors).to.have.ownProperty('BadRequestError');
        expect(errors).to.have.ownProperty('InternalServerError');
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
});
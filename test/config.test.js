// Test requirements
var expect = require('chai').expect;
var sinon = require('sinon');
var join = require('path').join;

var initConfig = require('../lib/config');

var sandbox = sinon.sandbox.create();

describe('Config', function () {
    var processCWDStub;

    afterEach(function () {
        sandbox.restore();
    });

    function fixturePath(path) {
        return join(__dirname, 'config-fixtures', path || '');
    }

    it('Ignition does NOT have config', function () {
        processCWDStub = sandbox.spy(process, 'cwd');
        var config = initConfig(true);

        expect(processCWDStub.firstCall.returnValue).to.match(/Ignition/i);
        expect(config.get('test')).to.be.undefined;
        expect(config.get('should-be-used')).to.be.undefined;
    });

    it('loads root config when called by root JS file', function () {
        processCWDStub = sandbox.stub(process, 'cwd').returns(fixturePath());
        var config = initConfig(true);

        expect(config.stores.file.file).to.match(/Ignition\/test\/config-fixtures\/config\.development\.json$/i);
        expect(config.get('test')).to.equal('root-config');
        expect(config.get('should-be-used')).to.be.true;
    });

    it('loads root config when called from a script in a subdirectory', function () {
        processCWDStub = sandbox.stub(process, 'cwd').returns(fixturePath('scripts'));
        var config = initConfig(true);

        expect(config.stores.file.file).to.match(/Ignition\/test\/config-fixtures\/config\.development\.json$/i);
        expect(config.get('test')).to.equal('root-config');
        expect(config.get('should-be-used')).to.be.true;
    });
});

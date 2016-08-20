var should = require('chai').should(),
    BLEScanner = require('../components/ble');

describe('BLEScanner', function () {
    describe('constructor', function () {
        var callback = function () {};
        var scanner = new BLEScanner(callback);

        scanner.callback.should.be.a('function');
        scanner.kalmanManager.should.be.an('object');
        scanner.kalmanManager.should.be.empty();
    })
});
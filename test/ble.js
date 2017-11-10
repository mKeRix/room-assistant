var expect = require('chai').expect;
var BLEScanner = require('../components/ble');

describe('BLEScanner', function () {
    describe('constructor', function () {
        var callback = function () {};
        var scanner = new BLEScanner(callback);

        expect(scanner.callback).to.be.a('function');
        expect(scanner.kalmanManager).to.be.an('object');
        expect(scanner.kalmanManager).to.be.empty;
    })
});

var config = require('config');
var bleacon = require('bleacon');
var console = process.console;

var channel = config.get('ibeacon.channel');

function iBeaconScanner(callback) {
    // constructor
    this.callback = callback;

    this._init();
    console.info('iBeacon scanner was initialized');
}

iBeaconScanner.prototype._init = function () {
    bleacon.startScanning();
    bleacon.on('discover', this._handlePacket.bind(this));
};

iBeaconScanner.prototype._handlePacket = function (ibeacon) {

    // check if we have a whitelist
    // and if we do, if this id is listed there
    var whitelist = config.get('ibeacon.whitelist') || [];
    if (whitelist.length == 0 || whitelist.indexOf(ibeacon.uuid) > -1) {

	id = ibeacon.uuid + '-' + ibeacon.major + '-' + ibeacon.minor
        // max distance parameter checking
        var maxDistance = config.get('ibeacon.max_distance') || 0;
        if (maxDistance == 0 || ibeacon.accuracy <= maxDistance) {

            var payload = {
		id: id,
                uuid: ibeacon.uuid,
                major: ibeacon.major,
		minor: ibeacon.minor,
                rssi: ibeacon.rssi,
		distance: ibeacon.accuracy,
		measuredpower: ibeacon.measuredPower,
		proximity: ibeacon.proximity
            };

            this.callback(channel, payload);
        }
    }
};

module.exports = iBeaconScanner;

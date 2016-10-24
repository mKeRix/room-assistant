var config = require('config');
var bleacon = require('bleacon');
var console = process.console;

var KalmanFilter = require('kalmanjs').default;

var channel = config.get('ibeacon.channel');

function iBeaconScanner(callback) {
    // constructor
    this.callback = callback;
    this.kalmanManager = {};

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

        // default hardcoded value for beacon tx power
        var txPower = ibeacon.measuredPower || -59;
        var distance = this._calculateDistance(ibeacon.rssi, txPower);

        id = ibeacon.uuid + '-' + ibeacon.major + '-' + ibeacon.minor
        // max distance parameter checking
        var maxDistance = config.get('ibeacon.max_distance') || 0;
        if (maxDistance == 0 || ibeacon.accuracy <= maxDistance) {
            var filteredDistance = this._filter(id, distance);

            var payload = {
		id: id,
                uuid: ibeacon.uuid,
                major: ibeacon.major,
		minor: ibeacon.minor,
                rssi: ibeacon.rssi,
		distance: filteredDistance,
		accuracy: ibeacon.accuracy,
		measuredpower: ibeacon.measuredPower,
		proximity: ibeacon.proximity
            };

            this.callback(channel, payload);
        }
    }
};

iBeaconScanner.prototype._calculateDistance = function (rssi, txPower) {
    if (rssi == 0) {
        return -1.0;
    }

    var ratio = rssi * 1.0 / txPower;
    if (ratio < 1.0) {
        return Math.pow(ratio, 10);
    }
    else {
        return (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    }
};

iBeaconScanner.prototype._filter = function (id, distance) {
    if (!this.kalmanManager.hasOwnProperty(id)) {
        this.kalmanManager[id] = new KalmanFilter({
            R: config.get('ibeacon.system_noise') || 0.01,
            Q: config.get('ibeacon.measurement_noise') || 3
        });
    }

    return this.kalmanManager[id].filter(distance);
};


module.exports = iBeaconScanner;

var config = require('config');
var noble = require('noble');
//var console = process.console;

var KalmanFilter = require('kalmanjs').default;

var channel = config.get('ble.channel');
var updateFreq = parseInt(config.get('ble.update_frequency'), 0);

var lastUpdateTimeMap = new Map();

function BLEScanner(callback) {
    // constructor
    this.callback = callback;
    this.kalmanManager = {};

    this._init();
    console.info('BLE scanner was initialized');
}

BLEScanner.prototype._init = function () {
    noble.on('stateChange', this._startScanning.bind(this));
    noble.on('discover', this._handlePacket.bind(this));
};

BLEScanner.prototype._startScanning = function (state) {
    if (state === 'poweredOn') {
        noble.startScanning([], true);
    }
    else {
        noble.stopScanning();
    }
};

BLEScanner.prototype._handlePacket = function (peripheral) {

    var advertisement = peripheral.advertisement;

    var id;
    if (config.get('ble.use_mac')) {
        id = peripheral.address;
    } else {
        id = peripheral.id;
    }

    // check if we have a whitelist or blacklist
    // and if we do, if this id is listed there
    var whitelist = config.get('ble.whitelist') || [];
    var blacklist = config.get('ble.blacklist') || [];
    var use_whitelist = whitelist.length > 0;
    var use_blacklist = blacklist.length > 0;
    
    // If white list not in use || id is found on white list then white list = true
    // If white list true (not in use or found) and blacklist not in use or id NOT blacklisted = true
    if ((!use_whitelist || whitelist.includes(id))
     && (!use_blacklist || !blacklist.includes(id))) {
        if (updateFreq > 0) {
            var currTime = new Date();
            var lastUpdateTime = lastUpdateTimeMap.get(peripheral.id);
            if (lastUpdateTime === undefined) {
                lastUpdateTimeMap.set(id,currTime);
            } else {
                if ((currTime - lastUpdateTime) < (updateFreq*1000)) {
                    return;
                }
                lastUpdateTimeMap.set(id,currTime);
            }
        }

        // default hardcoded value for beacon tx power
        var txPower = advertisement.txPowerLevel || -59;
        var distance = this._calculateDistance(peripheral.rssi, txPower);

        // max distance parameter checking
        var maxDistance = config.get('ble.max_distance') || 0;
        if (maxDistance == 0 || distance <= maxDistance) {
            var filteredDistance = this._filter(id, distance);

            var payload = {
                id: id,
                name: advertisement.localName,
                rssi: peripheral.rssi,
                distance: filteredDistance
            };

            this.callback(channel, payload);
        }
    }
};

BLEScanner.prototype._calculateDistance = function (rssi, txPower) {
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

BLEScanner.prototype._filter = function (id, distance) {
    if (!this.kalmanManager.hasOwnProperty(id)) {
        this.kalmanManager[id] = new KalmanFilter({
            R: config.get('ble.system_noise') || 0.01,
            Q: config.get('ble.measurement_noise') || 3
        });
    }

    return this.kalmanManager[id].filter(distance);
};

module.exports = BLEScanner;

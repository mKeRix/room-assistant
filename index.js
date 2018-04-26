var scribe = require('scribe-js')({ createDefaultConsole : false });

var config = require('config');
process.console = scribe.console({ logWriter: config.get('app.logging') });
var console = process.console;

var Publisher = require('./components/publisher');
if (config.get('ble.enabled')) {
    var BLEScanner = require('./components/ble');
}
if (config.get('ibeacon.enabled')) {
    var IBeaconScanner = require('./components/ibeacon');
}
if (config.get('temper.enabled')) {
    var Temper = require('./components/temper');
}
if (config.get('gpio.enabled')) {
    var GPIO = require('./components/gpio');
}
if (config.get('shell.enabled')) {
    var Shell = require('./components/shell');
}

function RoomAssistantApp() {
    console.info('Starting Room Assistant...');

    if (config.get('app.unsafe')) {
        // catch the uncaught errors that weren't wrapped in a domain or try catch statement
        process.on('uncaughtException', function(err) {
            // handle the error safely
            console.error(err);
        });
    }

    this._init();
}

RoomAssistantApp.prototype._init = function () {
    // publishers
    this.publisher = new Publisher();

    // components
    if (config.get('ble.enabled')) {
        this._setupBLE();
    }
    if (config.get('ibeacon.enabled')) {
        this._setupiBeacon();
    }
    if (config.get('temper.enabled')) {
        this._setupTemper();
    }
    if (config.get('gpio.enabled')) {
        this._setupGPIO();
    }
    if (config.get('shell.enabled')) {
        this._setupShell();
    }
};

RoomAssistantApp.prototype._setupBLE = function () {
    return new BLEScanner(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupiBeacon = function () {
    return new IBeaconScanner(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupTemper = function () {
    return new Temper(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupGPIO = function () {
    return new GPIO(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupShell = function () {
    return new Shell(this.publisher.publish.bind(this.publisher));
};

// start the app
var app = new RoomAssistantApp();

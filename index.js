require('scribe-js')();

var config = require('config');
var console = process.console;

var Publisher = require('./components/publisher');
if (config.get('ble.enabled')) {
    var BLEScanner = require('./components/ble');
}
if (config.get('temper.enabled')) {
    var Temper = require('./components/temper');
}
if (config.get('gpio.enabled')) {
    var GPIO = require('./components/gpio');
}

function RoomAssistantApp() {
    console.info('Starting Room Assistant...');
    this._init();
}

RoomAssistantApp.prototype._init = function () {
    // publishers
    this.publisher = new Publisher();

    // components
    if (config.get('ble.enabled')) {
        this._setupBLE();
    }
    if (config.get('temper.enabled')) {
        this._setupTemper();
    }
    if (config.get('gpio.enabled')) {
        this._setupGPIO();
    }
};

RoomAssistantApp.prototype._setupBLE = function () {
    return new BLEScanner(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupTemper = function () {
    return new Temper(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupGPIO = function () {
    return new GPIO(this.publisher.publish.bind(this.publisher));
};

// start the app
var app = new RoomAssistantApp();

require('scribe-js')();

var config = require('config');
var console = process.console;

var MQTTPublisher = require('./components/mqtt.js');
var BLEScanner = require('./components/ble.js');

function RoomAssistantApp() {
    console.info('Starting Room Assistant...');
    this._init();
}

RoomAssistantApp.prototype._init = function () {
    this.publisher = this._setupMQTT();

    this._setupBLE(this.publisher.publish.bind(this.publisher));
};

RoomAssistantApp.prototype._setupMQTT = function () {
    return new MQTTPublisher();
};

RoomAssistantApp.prototype._setupBLE = function (callback) {
    return new BLEScanner(callback);
};

// start the app
var app = new RoomAssistantApp();

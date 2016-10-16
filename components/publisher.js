var config = require('config');
var console = process.console;

var MQTTPublisher = require('./mqtt');
var ConsolePublisher = require('./console');

function Publisher() {
  this._init();
}

Publisher.prototype.publish = function (channel, payload) {
  if (this.mqttPublish) {
    this.mqttPublish(channel, payload);
  }
  if (this.consolePublish) {
    this.consolePublish(channel, payload);
  }
};

Publisher.prototype._init = function () {
  // publishers
  if (config.get('mqtt.enabled')) {
    this.mqttPublish = this._setupMQTT();
  }
  if (config.get('console.enabled')) {
    this.consolePublish = this._setupConsole();
  }
};

Publisher.prototype._setupMQTT = function () {
  var mqttPublisher = new MQTTPublisher();
  return mqttPublisher.publish.bind(mqttPublisher);
};

Publisher.prototype._setupConsole = function () {
  var consolePublisher = new ConsolePublisher();
  return consolePublisher.publish.bind(consolePublisher);
};

module.exports = Publisher;

var config = require('config');
var mqtt = require('mqtt');
var console = process.console;

function MQTTPublisher() {
    var options = {
        username: config.get('mqtt.username'),
        password: config.get('mqtt.password')
    };

    this.client = mqtt.connect(config.get('mqtt.url'), options);
}

MQTTPublisher.prototype.publish = function (channel, payload) {
    var topic = config.get('mqtt.topic') + '/' + channel;
    this.client.publish(topic, JSON.stringify(payload));
};

module.exports = MQTTPublisher;

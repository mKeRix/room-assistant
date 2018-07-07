'use strict';

const mqtt = require('mqtt');

module.exports = {
    name: 'mqtt',

    settings: {
        mqtt: {
            url: process.env.MQTT_URL,
            options: {
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD
            },
            topic: process.env.ROOM_NAME || 'default-room'
        }
    },

    events: {
        'data.found'(payload) {
            const subTopic = `${payload.channel}/${this.settings.mqtt.topic}`;

            this.client.publish(subTopic, JSON.stringify(payload.data), payload.options);
        }
    },

    created() {
        this.client = mqtt.connect(this.settings.mqtt.url, this.settings.mqtt.options);

        this.client.on('connect', () => {
            this.broker.logger.info(`Connected to ${this.settings.mqtt.url}`);
        });
    }
};

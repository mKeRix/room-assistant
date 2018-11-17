'use strict';

const config = require('config');

const PromService = require('moleculer-prometheus');

module.exports = {
    mixins: [PromService],

    settings: {
        port: config.get('prometheus.port')
    }
};

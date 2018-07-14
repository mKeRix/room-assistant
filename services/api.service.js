'use strict';

const config = require('config');

const ApiGatewayService = require('moleculer-web');

module.exports = {
    name: 'api',

    mixins: [ApiGatewayService],

    settings: {
        port: config.get('api.port'),

        logRequestParams: 'debug',
        logResponseData: 'debug',

        routes: [
            {
                mappingPolicy: 'restrict',
                aliases: {
                    'GET metrics': 'prometheus.metrics'
                },
                bodyParsers: {
                    json: false
                }
            }
        ]
    }
};

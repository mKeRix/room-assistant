'use strict';

module.exports = {
    name: 'console',

    events: {
        'data.found'(payload) {
            this.logger.info(`${payload.channel}: ${JSON.stringify(payload.data)}`);
        }
    }
};

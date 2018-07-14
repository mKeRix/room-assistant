'use strict';

module.exports = {
    settings: {
        whitelist: []
    },

    methods: {
        isOnWhitelist(item) {
            return this.settings.whitelist.length < 1 || this.settings.whitelist.includes(item);
        }
    }
};

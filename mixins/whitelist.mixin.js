'use strict';

module.exports = {
    settings: {
        whitelist: [],
        whitelistRegex: false
    },

    methods: {
        isOnWhitelist(item) {
            if (this.settings.whitelist.length < 1) {
                return true;
            }

            if (this.settings.whitelistRegex) {
                return this.settings.whitelist.some(regex => item.match(regex));
            } else {
                return this.settings.whitelist.includes(item);
            }
        }
    }
};

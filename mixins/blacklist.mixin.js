'use strict';

module.exports = {
    settings: {
        blacklist: [],
        blacklistRegex: false
    },

    methods: {
        isOnBlacklist(item) {
            if (this.settings.blacklist.length < 1) {
                return false;
            }

            if (this.settings.blacklistRegex) {
                return this.settings.blacklist.some(regex => item.match(regex));
            } else {
                return this.settings.blacklist.includes(item);
            }
        }
    }
};

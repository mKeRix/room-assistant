'use strict';

module.exports = {
    settings: {
        frequency: 0
    },

    methods: {
        isThrottled(item) {
            if (this.settings.frequency > 0) {
                const now = new Date();

                if (this.callTimeMap.has(item)) {
                    const lastCallTime = this.callTimeMap.get(item);
                    const timeDiff = now - lastCallTime;

                    if (timeDiff < this.settings.frequency * 1000) {
                        return true;
                    }
                }

                this.callTimeMap.set(item, now);
            }

            return false;
        }
    },

    created() {
        this.callTimeMap = new Map();
    }
};

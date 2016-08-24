var config = require('config');
var gpio = require('pi-gpio');
var console = process.console;

function GPIO(callback) {
    // constructor
    this.callback = callback;
}

GPIO.prototype._init = function () {
    var that = this;

    var ports = config.get('gpio.ports');
    ports.forEach(function (port) {
        that._initRead(port.port, port.interval, port.channel);
    })
};

GPIO.prototype._initRead = function (port, interval, channel) {
    var that = this;

    gpio.open(port, 'input', function (err) {
        if (err) {
            console.error(err);
        }
        else {
            setInterval(that.read(port, channel), interval)
        }
    })
};

GPIO.prototype.read = function (port, channel) {
    var that = this;

    gpio.read(port, function (err, val) {
        if (err) {
            console.error(err);
        }
        else {
            var payload = {
                value: val
            };
            that.callback(channel, payload);
        }
    });
};

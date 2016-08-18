var config = require('config');
var temper = require('temper1');
var console = process.console;

var channel = config.get('temper.channel');
var scale = config.get('temper.scale');
var offset = config.get('temper.offset');

function Temper(callback) {
    // constructor
    this.callback = callback;

    this._init();
}

Temper.prototype._init = function () {
    var interval = config.get('temper.interval');
    setInterval(this.readTemperatures.bind(this), interval);
    console.info('Temper component was initialized')
};

Temper.prototype.readTemperatures = function () {
    var that = this;
    var devices = temper.getDevices();

    devices.forEach(function (device, index) {
        temper.readTemperature(device, function(err, value) {
            if (err) {
                console.error(err);
            }
            else {
                var payload = {
                    id: index,
                    temperature: scale * value + offset,
                    unit: 'C'
                };

                that.callback(channel, payload);
            }
        });
    })
};

module.exports = Temper;

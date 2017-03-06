var config = require('config');
var exec = require('child_process').exec;
var console = process.console;

function Shell(callback) {
  // constructor
  this.callback = callback;

  this.options = {
    qos: config.get('shell.qos'),
    retain: config.get('shell.retain')
  };

  this._init();
}

Shell.prototype._init = function () {
  var that = this;
  var commands = config.get('shell.commands');

  commands.forEach(function (command) {
    var regex = new RegExp(command.regexp);

    setInterval(function() {
      that.executeCommand(command.command, regex, command.channel, command.float)
    }, command.interval);

    console.info('Shell command \"' + command.command + '\" initialized')
  });
};

Shell.prototype.executeCommand = function (command, regex, channel, convertToFloat) {
  var that = this;

  exec(command, function(err, stdout, stderr) {
    if (err) {
      console.error(err);
    }
    if (stderr) {
      console.warning(stderr);
    }

    if (stdout) {
      var matches = stdout.match(regex);

      if (matches) {
        var match = matches[1];
        if (convertToFloat) {
          match = parseFloat(match);
        }

        var payload = {
          value: match
        };

        that.callback(channel, payload, that.options);
      }
    }
  })
};

module.exports = Shell;

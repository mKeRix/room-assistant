var console = process.console;

function ConsolePublisher() {
  console.info('Started console publisher');
}

ConsolePublisher.prototype.publish = function (channel, payload) {
  console.tag(channel).log(payload);
};

module.exports = ConsolePublisher;

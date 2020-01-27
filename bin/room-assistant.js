#!/usr/bin/env node
const commandLineUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  {
    name: 'help',
    description: 'Display this usage guide.',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'verbose',
    description: 'Turn on debugging output.',
    alias: 'v',
    type: Boolean
  }
];
const usage = commandLineUsage([
  {
    header: 'room-assistant',
    content:
      'A companion client for Home Assistant to handle presence detection and sensors in multiple rooms.'
  },
  {
    header: 'Options',
    optionList: optionDefinitions
  }
]);
const options = commandLineArgs(optionDefinitions);

if (options.help) {
  console.log(usage);
  return;
}

process.env.NODE_LOG_LEVEL = options.verbose
  ? 'verbose'
  : process.env.NODE_LOG_LEVEL || 'production';

require('../dist/main');

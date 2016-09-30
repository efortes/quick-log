'use strict';

const fileLogger = require('./lib/file-logger');
const config = require('./config');
module.exports = {
  setConfig: (newConfig) => {
    Object.assign(config, newConfig);
  },
  fileLogger: require('./lib/file-logger'),
  QueueLog: require('./lib/queue-log')
}

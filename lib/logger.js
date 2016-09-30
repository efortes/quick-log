'use strict'

const fs = require('fs');
const config = require("../config");
const LogHelper = require("./log-helper");

/**
 * File logger d
 */
class Log {

  constructor() {
    this.fileDescriptor = null;
    this.fileDescriptorTimeout = null;
  }

  /**
   * Open file path
   * @param path
   * @returns {null}
   */
  setFileDescriptor(path) {
    try {
      return fs.openSync(path, 'a', '0777');
    } catch (e) {
      console.error('Error opening log file:', e);
      return null;
    }
  }

  /**
   * Build log message
   */
  buildLogMessage(processId, clientIp, message, processName, type) {
    var message = LogHelper.getCurrentDate() + ' ' + "(" + (type ? type.toUpperCase() + ") - " : " - ") + "" + (processId ? processId + " - " : "") + (clientIp ? clientIp + " - " : "") + message + "\n";
    return message;
  }


  /**
   * Write logs
   * @param String log
   * @param <Object> options
   */
  log(message, options) {
    const _this = this;

    const _options = Object.assign({}, {
      type: 'normal', // normal, error
      processName: config.logName,
      processId: false, // If processId === true lets auto generate and log id. Any other value (not false) will be used as ID
      formatMessage: true,
      clientIp: null
    }, options || {});

    // If processId === true lets auto generate and log id
    if (_options.processId === true) {
      _options.processId = GripUtil.token.generateRandomToken({length: 10});
    }

    let formattedMessage = message;

    if (typeof formattedMessage === 'object') {
      formattedMessage = formattedMessage.toString();
    }

    try {
      fs.accessSync(config.logPath, fs.F_OK);
      // Do something
    } catch (e) {
      return console.error('File path does not exist', e)
    }

    if (!this.fileDescriptor) {
      this.fileDescriptor = this.setFileDescriptor(config.logPath + config.logFile);
    }

    if (_options.formatMessage) {
      formattedMessage = this.buildLogMessage(_options.processId, _options.clientIp, formattedMessage, _options.processName, _options.type);
    }

    // Only console log in the local env
    if (config.logToConsole) {
      const consoleLog = formattedMessage.replace('\n', '');
      if (_options.type === 'error') {
        console.error(consoleLog);
      } else {
        console.log(consoleLog);
      }
    }

    // Clear close timeout method
    if (this.fileDescriptorTimeout) clearTimeout(this.fileDescriptorTimeout);

    // Close the file
    this.fileDescriptorTimeout = setTimeout(() => {
      fs.closeSync(this.fileDescriptor);
      _this.fileDescriptor = null;
      if (config.logToConsole >= 4) {
        console.log('File descriptor closed');
      }
    }, 60000);

    // Write message
    fs.write(this.fileDescriptor, formattedMessage, null, 'utf8', (err) => {
      if (err) console.error(err);
    });
  }
}

module.exports = new Log();

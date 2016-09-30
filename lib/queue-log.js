'use strict'

const fs = require('fs');
const config = require("../config");
const logger = require("./logger");
const LogHelper = require("./log-helper");

/**
 * File logger
 */
class Log {

  /**
   * Cached logging. Cache all teh log messages and write them at the end
   * @param options {
   *  <String> / <Integer> referenceId
   *  <String> / <Integer> referenceName
   *  <boolean> timeoutOpt After x minutes we should write the cache if its not written to prevent data lose when the write is not called. The default is set in the main options. 'null' for no timeout
      <boolean> quickLog
   * }
   * @returns CachedLog obj
   */
  constructor(options) {

    const _this = this;

    this.seperator = "---------";

    // Cached messages
    this.cache = [];

    // Check if the write functionis called
    this.isWritten = false;

    this.options = null;

    // BAckward comp
    if (typeof (options) !== 'object') {
      this.options = {
        referenceId: arguments[0],
        referenceName: arguments[1],
        timeoutOpt: arguments[2] || config.autoLogOnTimeoutMilisec,
        quickLog: arguments[3] || false,
        processId: arguments[4] || true,
      }
    } else {
      this.options = Object.assign({}, {
        referenceId: null,
        referenceName: null,
        timeoutOpt: config.autoLogOnTimeoutMilisec,
        quickLog: false,
        processId: true, // if === true lets auto generate an id. Else use the current ID
      }, options);
    }

    // If processId === true lets generate and log id
    if (this.options.processId === true) {
      this.options.processId = LogHelper.generateRandomToken({length: 10});
    }

    //Init log
    const refStr = this.options.referenceId ? `( ${this.options.referenceId} ) ` : '';
    _this.log(_this.seperator + " INIT " + (this.options.referenceName ? this.options.referenceName + ' ' : ' ') + refStr + _this.seperator + '\n');

    //After 2 minutes we should write the cache if its not written to prevent data lose when the write is not called
    if (config.autoLogOnTimeoutMilisec) {
      let totalLogCheck = 0;
      setInterval(function() {
        if (!_this.isWritten) {
          if (_this.getCache().length > 0) {

            // After many checks just write error
            if (totalLogCheck >= 20) {
              _this.log("Log is never written");
              _this.log(_this.seperator + "-------------- Cache log TIMEOUT --------------" + _this.seperator);
              _this.write("error");
              return;
            }

            totalLogCheck++;

            logger.log(`- ${_this.options.processId} - `, 'Cache log is not written yet', (_this.options.referenceName ? 'Reference: ' + _this.options.referenceName : ' ') + "(" + _this.options.referenceId + ") ");
          }
        }
      }, config.autoLogOnTimeoutMilisec); //2 min
    }
  }

  /**
   * Log message
   */
  log(message) {
    var message = this.buildMessage(message, this.options.processId);

    if (this.options.quickLog) {
      console.log("QUICK log ref (" + this.options.referenceId + "): " + message);
    }

    this.cache.push(message);
  }

  /**
   * Get cached messages
   */
  getCache() {
    return this.cache;
  }


  /**
   * Build the message
   * @param <String> message
   */
  buildMessage(message, processId) {
    const processIDStr = processId ? ` - ${processId} - ` : ' ';
    return LogHelper.getCurrentDate() + processIDStr + message + "\n";
  }

  /**
   * Write the cached log to the file system
   * @param <String> type (normal, error)
   */
  write(type) {
    var _this = this;
    if (typeof(type) == "undefined") {
      type = 'normal';
    }

    //Log end cache
    const refStr = this.options.referenceId ? `( ${this.options.referenceId} ) ` : '';
    _this.log(this.seperator + " (" + type.toUpperCase() + ") " + " END " + (this.options.referenceName ? this.options.referenceName + ' ' : ' ') + refStr + this.seperator, type);

    _this.isWritten = true;
    //Write log
    logger.log(this.getCache().join(""), {
      type: type,
      processName: this.options.referenceName,
      processId: this.options.processId,
      clientIp: this.options.clientIp,
      formatMessage: false,
    });
  }
}

module.exports = Log;

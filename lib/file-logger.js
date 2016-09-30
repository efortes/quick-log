'use strict';

const logger = require("./logger");

/**
 * File logger
 */
class Log {

  /**
   * Write error; extra function to conform to console interface
   * @param <String> log
   * @param <Object> options
   */
  error(message, options) {
    const _options = Object.assign({}, options || {});
    _options.type = 'error';
    logger.log(message, _options);
  }

  /**
   * Log a normal message
   * @param <string> message
   * @param <Object> options
   */
  log(message, options) {
    const _options = Object.assign({}, options || {});
    _options.type = "normal";
    logger.log(message, _options);
  }
}

module.exports = new Log();

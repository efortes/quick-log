'use strict';

class LogHelper {

  static getCurrentDate() {
    const date = new Date();
    const zeroBasedFormat = function(val) {
      const formattedVal = parseInt(val, null);
      return (formattedVal < 10 ? '0' + formattedVal : formattedVal);
    };
    return date.getFullYear() + '-' + zeroBasedFormat(date.getMonth() + 1) + '-' + zeroBasedFormat(date.getDate()) + ' ' + zeroBasedFormat(date.getHours()) + ':' + zeroBasedFormat(date.getMinutes()) + ':' + zeroBasedFormat(date.getSeconds());
  }

  static generateRandomToken(params) {
    let token = '';
    params.chars = params.chars || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    params.length = params.length || 25;

    for (let i = 0; i < params.length; i++) {
      const rnd = Math.floor(params.chars.length * Math.random());
      const chr = params.chars.substring(rnd, rnd + 1);
      token = token + chr;
    }

    return token;
  }

}

module.exports = LogHelper
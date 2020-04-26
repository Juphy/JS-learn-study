'use strict';

var utils = require('../utils');

module.exports = (
    utils.isStandardBrowserEnv() ? (function standardBrowserEnv() {
        return {
            write: function write(name, value, expires, path, domain, secure) {
                var cookie = [];
                cookie.push(name + '=' + encodeURIComponent(value));
                if(utils.isNumber(expires)){
                    cookie.push('expires')
                }
            }
        }
    }) : ()
)
/**
 * This class module contains numerous helper functions that are used throughout the application.
 * Additional functions used repeatedly shoud also be stored here. They are stored in the global skritter namespace.
 * 
 * @module Skritter
 * @class Functions
 * @param Bootstrap
 * @author Joshua McFarland
 */
define([
    'Bootstrap'
], function(Bootstrap) {
    /**
     * @property {Object} bootstrap
     */
    var bootstrap = Bootstrap;
    /**
     * @method bytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    var bytesToSize = function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0)
            return '';
        var value = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, value)).toFixed(2) + ' ' + sizes[value];
    };
    /**
     * Checks to see if one of the approved live server domains is being used or not.
     * 
     * @method isLocal
     * @param {String} hostname
     * @returns {Boolean}
     */
    var isLocal = function(hostname) {
        hostname = hostname ? hostname : document.location.hostname || window.location.hostname || location.hostname;
        if (hostname === 'html5.skritter.com' || hostname === 'html5.skritter.cn')
            return false;
        return true;
    };
    /**
     * @method isNumber
     * @param {Number} number
     * @returns {Boolean}
     */
    var isNumber = function(number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    };
    /**
     * @method getUnixTime
     * @param {Boolean} milliseconds
     * @returns {Number}
     */
    var getUnixTime = function(milliseconds) {
        var unixtime = new Date().getTime();
        return milliseconds ? unixtime : Math.round(unixtime / 1000);
    };

    return {
        bootstrap: bootstrap,
        bytesToSize: bytesToSize,
        getUnixTime: getUnixTime,
        isLocal: isLocal,
        isNumber: isNumber
    };
});

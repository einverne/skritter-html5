/**
 * This class module contains numerous helper functions that are used throughout the application.
 * Additional functions used repeatedly shoud also be stored here. They are stored in the global skritter namespace.
 * 
 * @module Skritter
 * @class Functions
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method bytesToSize
     * @param {Number} bytes
     * @returns {String}
     */
    var bytesToSize = function(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0)
            return '';
        var i = parseFloat(Math.floor(Math.log(bytes) / Math.log(1024)));
        return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
    };
    
    /**
     * @method concatObjectArray
     * @param {Array} objectArray1
     * @param {Array} objectArray2
     * @returns {Array}
     */
    var concatObjectArray = function(objectArray1, objectArray2) {
        return Array.isArray(objectArray1) ? objectArray1.concat(objectArray2) : undefined;
    };
    
    /**
     * @method extractCJK
     * @param {String} value
     * @returns {Array}
     */
    var extractCJK = function(value) {
        return value.match(/[\u4e00-\u9fcc]|[\u3400-\u4db5]/gi);
    };
    
    /**
     * @method getAngle
     * @param {Array} points An array of point values
     * @return {Number} The angle formed by the first and last points
     */
    var getAngle = function(points) {
        var point1 = points[0];
        var point2 = points[points.length - 1];
        var xDiff = point2.x - point1.x;
        var yDiff = point2.y - point1.y;
        return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
    };
    
    /**
     * @method getBoundingRectangle
     * @param {Array} points An array of point values
     * @param {Number} areaWidth The width of the canvas area
     * @param {Number} areaHeight The height of the canvas area
     * @param {Number} pointRadius The radius of
     * @return {Object} The bounds of the calculated rectangle
     */
    var getBoundingRectangle = function(points, areaWidth, areaHeight, pointRadius) {
        var left = areaWidth;
        var top = 0.0;
        var right = 0.0;
        var bottom = areaHeight;

        for (var i in points) {
            var x = points[i].x;
            var y = points[i].y;
            if (x - pointRadius < left)
                left = x - pointRadius;
            if (y + pointRadius > top)
                top = y + pointRadius;
            if (x + pointRadius > right)
                right = x + pointRadius;
            if (y - pointRadius < bottom)
                bottom = y - pointRadius;
        }

        var width = right - left;
        var height = top - bottom;
        var center = {x: width / 2, y: height / 2};

        return {x: left, y: bottom, w: width, h: height, c: center};
    };

    /**
     * @method getDistance
     * @param {Point} point1
     * @param {Point} point2
     * @return {Number} The distance between the first and last points
     */
    var getDistance = function(point1, point2) {
        var xs = point2.x - point1.x;
        xs = xs * xs;
        var ys = point2.y - point1.y;
        ys = ys * ys;
        return Math.sqrt(xs + ys);
    };

    /**
     * @method getLineDeviation
     * @param {Point} start The starting point of a line segment
     * @param {Point} end The ending point of a line segment
     * @param {Point} point Point to measure distance from the line segment
     * @return {Number} The distance from the point and line segment
     */
    var getLineDeviation = function(start, end, point) {
        var px = end.x - start.x;
        var py = end.y - start.y;
        var segment = (px * px) + (py * py);
        var z = ((point.x - start.x) * px + (point.y - start.y) * py) / parseFloat(segment);
        if (z > 1) {
            z = 1;
        } else if (z < 0) {
            z = 0;
        }
        var x = start.x + z * px;
        var y = start.y + z * py;
        var dx = x - point.x;
        var dy = y - point.y;
        return Math.sqrt((dx * dx) + (dy * dy));
    };
    
    /**
     * @method getMySqlDateFormat
     * @param {Number} unixTime
     * @returns {String}
     */
    var getMySqlDateFormat = function(unixTime) {
        var date = (unixTime) ? new Date(unixTime * 1000) : new Date();
        var dateString = date.getUTCFullYear() + '-' +
                pad((date.getUTCMonth() + 1), '0', 2) + '-' +
                pad(date.getUTCDate(), '0', 2) + ' ' +
                pad(date.getUTCHours(), '0', 2) + ':' +
                pad(date.getUTCMinutes(), '0', 2) + ':' +
                pad(date.getUTCSeconds(), '0', 2);
        return dateString;
    };
    
    /**
     * @method getPressurizedStrokeSize
     * @param {Number} strokeSize
     * @param {Point} point1
     * @param {Point} point2
     * @returns {Number}
     */
    var getPressurizedStrokeSize = function(point1, point2, strokeSize) {
        strokeSize = (strokeSize) ? strokeSize : 18;
        var speed = getDistance(point1, point2);
        if (speed < 15) {
           strokeSize *= 1.00; 
        } else if (speed < 20) {
           strokeSize *= 0.95; 
        } else if (speed < 25) {
           strokeSize *= 0.90; 
        } else if (speed < 30) {
           strokeSize *= 0.85; 
        } else if (speed < 35) {
           strokeSize *= 0.80; 
        } else {
           strokeSize *= 0.75; 
        }
        return strokeSize;
    };
    
    /**
     * @getRandomInt
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    var getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    /**
     * @method getUnixTime
     * @param {Boolean} milliseconds If true then the returned time will include milliseconds
     * @return {Number} The current unix time
     */
    var getUnixTime = function(milliseconds) {
        var date = new Date();
        if (milliseconds) {
            return date.getTime();
        }
        return Math.round(date.getTime() / 1000);
    };

    /**
     * Takes a the first character from a string and return whether it is a kana character.
     * 
     * NOTE: It's also currently checking for the unicode tilde because those need to be filtered
     * out of Japanese writings as well. For Chinese it's also filtering out periods, but I don't
     * think they are actually an issue when it comes to rune prompts.
     * 
     * @method isKana
     * @param {String} character
     * @returns {Boolean}
     */
    var isKana = function(character) {
        var charCode = character.charCodeAt(0);
        return (charCode > 12352 && charCode < 12438) || (charCode > 12449 && charCode < 12538) || charCode === 65374 || charCode === 46;
    };
    
    /**
     * @method isLocal
     * @returns {Boolean}
     */
    var isLocal = function() {
        var hostname = document.location.hostname || window.location.hostname || location.hostname;
        if (hostname === 'html5.skritter.com' || hostname === 'html5.skritter.cn')
            return false;
        return true;
    };
    
    /**
     * @method isMobile
     * @returns {Boolean}
     */
    var isMobile = function() {
        if (navigator.userAgent.match(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i))
            return true;
        return false;
    };

    /**
     * @method maskText
     * @param {String} text The text to be masked
     * @param {String} value The value in the text to mask
     * @param {String} mask The mask to apply to the contained values
     * @return {String} The text with the specied value masked
     */
    var maskCharacters = function(text, value, mask) {
        text = '' + text;
        value = '' + value;
        mask = '' + mask;
        var chars = value.split('');
        for (var i in chars) {
            var expression = new RegExp(chars[i], 'gi');
            text = text.replace(expression, mask);
        }
        return text;
    };
    
    /**
     * @method pad
     * @param {String} text The text requiring padding
     * @param {String} value The value to be applied as padding
     * @param {Number} size The number of spaces of padding to be applied
     * @return {String}
     */
    var pad = function(text, value, size) {
        value = '' + value;
        var string = text + '';
        while (string.length < size)
            string = value + '' + string;
        return string;
    };
    
    /**
     * @method sortAlphabetically
     * @param {Array} array
     * @param {String} field
     * @param {Boolean} descending
     * @returns {Array}
     */
    var sortAlphabetically = function(array, field, descending) {
        return array.sort(function(a, b) {
            if (descending) {
                if (a[field] > b[field])
                    return -1;
                if (a[field] < b[field])
                    return 1;
            } else {
                if (a[field] < b[field])
                    return -1;
                if (a[field] > b[field])
                    return 1;
            }
            return 0;
        });
    };
    
    /**
     * Returns a Bootstrap alert of the given level containing the given text.
     * 
     * @method twbsAlertHTML
     * @param {String} level One of {success, info, warning, danger}
     * @param {String} text The alert text to be displayed
     */
    var twbsAlertHTML = function(level, text) {
        return "<div class='alert alert-" + level + "'>" +
                "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                text +
                "</div>";
    };

    return {
        bytesToSize: bytesToSize,
        concatObjectArray: concatObjectArray,
        extractCJK: extractCJK,
        getAngle: getAngle,
        getBoundingRectangle: getBoundingRectangle,
        getDistance: getDistance,
        getLineDeviation: getLineDeviation,
        getMySqlDateFormat: getMySqlDateFormat,
        getPressurizedStrokeSize: getPressurizedStrokeSize,
        getRandomInt: getRandomInt,
        getUnixTime: getUnixTime,
        isKana: isKana,
        isLocal: isLocal,
        isMobile: isMobile,
        maskCharacters: maskCharacters,
        pad: pad,
        sortAlphabetically: sortAlphabetically,
        twbsAlertHTML: twbsAlertHTML
    };
});

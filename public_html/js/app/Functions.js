/**
 * This class module contains numerous helper functions that are used throughout the application.
 * Additional functions used repeatedly shoud also be stored here. They are stored in the global Skritter namespace.
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


    return {
        bytesToSize: bytesToSize,
        getAngle: getAngle,
        getBoundingRectangle: getBoundingRectangle,
        getDistance: getDistance,
        getLineDeviation: getLineDeviation,
        getRandomInt: getRandomInt,
        getUnixTime: getUnixTime,
        maskCharacters: maskCharacters,
        pad: pad
    };
});
/**
 * ShortStrawJS, a javascript implementation
 * http://www.lab4games.net/zz85/blog/2010/01/21/geeknotes-shortstrawjs-fast-and-simple-corner-detection/
 *
 * Derived heavily from the AS3 implementation of the ShortStraw Corner Finder (Wolin et al. 2008)
 * by Felix Raab. 21 July 2009.
 * http://www.betriebsraum.de/blog/2009/07/21/efficient-gesture-recognition-and-corner-finding-in-as3/
 *
 * Based on the paper ShortStraw: A Simple and Effective Corner Finder for Polylines
 * http://srlweb.cs.tamu.edu/srlng_media/content/objects/object-1246294647-350817e4b0870da27e16472ed36475db/Wolin_SBIM08.pdf
 *
 * For comments on this JS port, email Joshua Koo (zz85nus @ gmail.com)
 *
 * Released under MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Shortstraw
     */
    function Shortstraw() {
        this.DIAGONAL_INTERVAL = 40;
        this.STRAW_WINDOW = 3;
        this.MEDIAN_THRESHOLD = 0.95;
        this.LINE_THRESHOLD = 0.95;
    }
    /**
     * @method boundingBox
     * @param {Array} points
     * @returns {Object}
     */
    Shortstraw.prototype.boundingBox = function(points) {
        var minX = Number.POSITIVE_INFINITY;
        var maxX = Number.NEGATIVE_INFINITY;
        var minY = Number.POSITIVE_INFINITY;
        var maxY = Number.NEGATIVE_INFINITY;
        for (var i = 0, len = points.length; i < len; i++) {
            var p = points[i];
            if (p.x < minX) {
                minX = p.x;
            }
            if (p.x > maxX) {
                maxX = p.x;
            }
            if (p.y < minY) {
                minY = p.y;
            }
            if (p.y > maxY) {
                maxY = p.y;
            }
        }
        return {x: minX, y: minY, w: maxX - minX, h: maxY - minY};
    };
    /**
     * @method determineResampleSpacing
     * @param {Array} points
     * @returns {Number}
     */
    Shortstraw.prototype.determineResampleSpacing = function(points) {
        var b = this.boundingBox(points);
        var p1 = {x: b.x, y: b.y};
        var p2 = {x: b.x + b.w, y: b.y + b.h};
        var d = this.distance(p1, p2);
        return d / this.DIAGONAL_INTERVAL;
    };
    /**
     * @method distance
     * @param {Object} p1
     * @param {Object} p2
     * @returns {Number}
     */
    Shortstraw.prototype.distance = function(p1, p2) {
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        return Math.pow((dx * dx + dy * dy), 1 / 2);
    };
    /**
     * @method getCorners
     * @param {Array} points
     * @returns {Array}
     */
    Shortstraw.prototype.getCorners = function(points) {
        var corners = [0];
        var w = this.STRAW_WINDOW;
        var straws = [];
        var i;
        for (i = w; i < points.length - w; i++) {
            straws[i] = (this.distance(points[i - w], points[i + w]));
        }
        var t = this.median(straws) * this.MEDIAN_THRESHOLD;
        for (i = w; i < points.length - w; i++) {
            if (straws[i] < t) {
                var localMin = Number.POSITIVE_INFINITY;
                var localMinIndex = i;
                while (i < straws.length && straws[i] < t) {
                    if (straws[i] < localMin) {
                        localMin = straws[i];
                        localMinIndex = i;
                    }
                    i++;

                }
                corners.push(localMinIndex);
            }
        }
        corners.push(points.length - 1);
        corners = this.postProcessCorners(points, corners, straws);
        return corners;
    };
    /**
     * @method halfwayCorner
     * @param {Array} straws
     * @param {Object} a
     * @param {Object} b
     * @returns {Number}
     */
    Shortstraw.prototype.halfwayCorner = function(straws, a, b) {
        var quarter = (b - a) / 4;
        var minValue = Number.POSITIVE_INFINITY;
        var minIndex;
        for (var i = a + quarter; i < (b - quarter); i++) {
            if (straws[i] < minValue) {
                minValue = straws[i];
                minIndex = i;
            }
        }
        return minIndex;
    };
    /**
     * @method isLine
     * @param {Array} points
     * @param {Object} a
     * @param {Object} b
     * @returns {Boolean}
     */
    Shortstraw.prototype.isLine = function(points, a, b) {
        var distance = this.distance(points[a], points[b]);
        var pathDistance = this.pathDistance(points, a, b);
        return (distance / pathDistance) > this.LINE_THRESHOLD;
    };
    /**
     * @method median
     * @param {Array} values
     * @returns {Number}
     */
    Shortstraw.prototype.median = function(values) {
        var s = values.concat();
        s.sort();
        var m;
        if (s.length % 2 === 0) {
            m = s.length / 2;
            return (s[m - 1] + s[m]) / 2;
        }
        m = (s.length + 1) / 2;
        return s[m - 1];
    };
    /**
     * @method pathDistance
     * @param {Array} points
     * @param {Object} a
     * @param {Object} b
     * @returns {Number}
     */
    Shortstraw.prototype.pathDistance = function(points, a, b) {
        var d = 0;
        for (var i = a; i < b; i++) {
            d += this.distance(points[i], points[i + 1]);
        }
        return d;
    };
    /**
     * @method postProcessCorners
     * @param {Array} points
     * @param {Array} corners
     * @param {Array} straws
     * @returns {Array}
     */
    Shortstraw.prototype.postProcessCorners = function(points, corners, straws) {
        var go = false;
        var i, c1, c2;
        while (!go) {
            go = true;
            for (i = 1; i < corners.length; i++) {
                c1 = corners[i - 1];
                c2 = corners[i];
                if (!this.isLine(points, c1, c2)) {
                    var newCorner = this.halfwayCorner(straws, c1, c2);
                    if (newCorner > c1 && newCorner < c2) {
                        corners.splice(i, 0, newCorner);
                        go = false;
                    }
                }
            }
        }
        for (i = 1; i < corners.length - 1; i++) {
            c1 = corners[i - 1];
            c2 = corners[i + 1];
            if (this.isLine(points, c1, c2)) {
                corners.splice(i, 1);
                i--;
            }
        }
        return corners;
    };
    /**
     * @method process
     * @param {Array} points
     * @returns {Array}
     */
    Shortstraw.prototype.process = function(points) {
        if (points && Array.isArray(points) && points.length > 0) {
            var s = this.determineResampleSpacing(points);
            var resampled = this.resamplePoints(points, s);
            var corners = this.getCorners(resampled);
            var cornerPoints = [];
            for (var i = 0, len = corners.length; i < len; i++)
                cornerPoints.push(resampled[corners[i]]);
            return cornerPoints;
        } else {
            return [];
        }
    };
    /**
     * @method resamplePoints
     * @param {Array} points
     * @param {Object} s
     * @returns {Array}
     */
    Shortstraw.prototype.resamplePoints = function(points, s) {
        var distance = 0;
        var resampled = [];
        resampled.push(points[0]);
        for (var i = 1; i < points.length; i++) {
            var p1 = points[i - 1];
            var p2 = points[i];
            var d2 = this.distance(p1, p2);
            if ((distance + d2) >= s) {
                var qx = p1.x + ((s - distance) / d2) * (p2.x - p1.x);
                var qy = p1.y + ((s - distance) / d2) * (p2.y - p1.y);
                var q = {x: qx, y: qy};
                resampled.push(q);
                points.splice(i, 0, q);
                distance = 0;
            } else {
                distance += d2;
            }
        }
        resampled.push(points[points.length -1]);
        return resampled;
    };
    
    return Shortstraw;
});
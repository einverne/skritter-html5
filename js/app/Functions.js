/*
 * 
 * Module: Functions
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * A useful set of global functions.
 * 
 */
define(function() {

    var bytesToSize = function(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0)
	    return null;
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    var getDistance = function(point1, point2) {
	var xs = point2.x - point1.x;
	xs = Math.pow(xs, 2);
	var ys = point2.y - point1.y;
	ys = Math.pow(ys, 2);
	return Math.sqrt(xs + ys);
    };

    var getDistanceToLineSegment = function(start, end, point) {
	var px = end.x - start.x;
	var py = end.y - start.y;

	var segment = Math.pow(px, 2) + Math.pow(py, 2);
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

	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };

    var getDirection = function(point1, point2) {
	var xDiff = point2.x - point1.x;
	var yDiff = point2.y - point1.y;
	return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
    };

    var getLength = function(corners) {
	var length = 0;
	for (var i = 0; i < corners.length - 1; i++)
	{
	    length += getDistance(corners[i], corners[i + 1]);
	}
	return length;
    };

    var getOrientation = function(corners) {
	var horizontal, vertical;
	var direction = getDirection(corners[0], corners[corners.length - 1]);
	if (Math.abs(direction) >= 90) {
	    horizontal = 'right-left';
	} else {
	    horizontal = 'left-right';
	}
	if (direction >= 0) {
	    vertical = 'top-bottom';
	} else {
	    vertical = 'bottom-top';
	}
	return {"horizontal": horizontal, "vertical": vertical};
    };

    var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var getRectangle = function(corners, maxWidth, maxHeight, offset) {
	var left = maxWidth;
	var top = 0.0;
	var right = 0.0;
	var bottom = maxHeight;
	for (var i in corners)
	{
	    var x = corners[i].x;
	    var y = corners[i].y;
	    var press_radius = offset;

	    if (x - press_radius < left)
		left = x - press_radius;
	    if (y + press_radius > top)
		top = y + press_radius;
	    if (x + press_radius > right)
		right = x + press_radius;
	    if (y - press_radius < bottom)
		bottom = y - press_radius;
	}
	return {x: left, y: bottom, w: right - left, h: top - bottom};
    };

    var getRectangleMidPoint = function(rectangle) {
	return new createjs.Point((rectangle.x + rectangle.w) / 2, (rectangle.y + rectangle.h) / 2);
    };

    var getUnixTime = function(milliseconds) {
	if (milliseconds)
	    return (new Date).getTime();
	return Math.round((new Date).getTime() / 1000);
    };

    var isDefined = function(variable) {
	return (typeof variable === 'undefined') ? false : true;
    };

    var isNull = function(variable) {
	return (variable === null) ? true : false;
    };

    var inArray = function(array, column, value) {
	for (var i = 0; i < array.length; i++)
	{
	    if (array[i][column] === value) {
		return true;
	    }
	}
	return false;
    };
    
    var maskText = function(text, mask) {
	var chars = mask.split('');
	for (var i in chars) {
	    var expression = new RegExp(chars[i], 'gi');
	    text = text.replace(expression, ' _ ');
	}
	return text;
    };

    var zeroPad = function(num, size) {
	var s = num + "";
	while (s.length < size)
	    s = "0" + s;
	return s;
    };


    return {
	bytesToSize: bytesToSize,
	getDistance: getDistance,
	getDistanceToLineSegment: getDistanceToLineSegment,
	getDirection: getDirection,
	getLength: getLength,
	getOrientation: getOrientation,
	getRandomInt: getRandomInt,
	getRectangle: getRectangle,
	getRectangleMidPoint: getRectangleMidPoint,
	getUnixTime: getUnixTime,
	inArray: inArray,
	isDefined: isDefined,
	isNull: isNull,
	maskText: maskText,
	zeroPad: zeroPad
    };
});
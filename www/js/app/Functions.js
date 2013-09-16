/*
 * 
 * Module: Functions
 * 
 * Created By: Joshua McFarland
 * 
 */
define(function() {
    
    var getAngle = function(points) {
	var point1 = points[0];
	var point2 = points[points.length-1];
	var xDiff = point2.x - point1.x;
	var yDiff = point2.y - point1.y;
	return (Math.atan2(yDiff, xDiff)) * (180 / Math.PI);
    };
    
    var getBoundingRectangle = function(points, areaWidth, areaHeight, pointRadius) {
	var left = areaWidth;
	var top = 0.0;
	var right = 0.0;
	var bottom = areaHeight;
	
	for (var i in points)
	{
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
	var center = {x: width/2, y: height/2};
	
	return {x: left, y: bottom, w: width, h: height, c: center};
    };
    
    var getDistance = function(point1, point2) {
	var xs = point2.x - point1.x;
	xs = Math.pow(xs, 2);
	var ys = point2.y - point1.y;
	ys = Math.pow(ys, 2);
	return Math.sqrt(xs + ys);
    };
    
    var getLineDeviation = function(start, end, point) {
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
    
    var getUnixTime = function(milliseconds) {
	if (milliseconds)
	    return (new Date).getTime();
	return Math.round((new Date).getTime() / 1000);
    };
    
    var isCordova = function() {
	if (window.cordova || window.PhoneGap || window.phonegap)
	    return true;
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
    
    var pad = function(text, value, size) {
	var string = text + '';
	while (string.length < size)
	    string = value + '' + string;
	return string;
    };
    
    
    return {
	getAngle: getAngle,
	getBoundingRectangle: getBoundingRectangle,
	getDistance: getDistance,
	getLineDeviation: getLineDeviation,
	getUnixTime: getUnixTime,
	isCordova: isCordova,
        maskText: maskText,
	pad: pad
    };
});
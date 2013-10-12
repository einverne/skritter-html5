/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Stopwatch
     */
    var Stopwatch = function() {
	var startAt = 0;
	var lapTime = 0;

	var now = function() {
            var date = new Date();
	    return date.getTime();
	};

	this.start = function() {
	    startAt = startAt ? startAt : now();
	};

	this.stop = function() {
	    lapTime = startAt ? lapTime + now() - startAt : lapTime;
	    startAt = 0;
	};

	this.reset = function() {
	    lapTime = startAt = 0;
	};

	this.time = function() {
	    return lapTime + (startAt ? now() - startAt : 0);
	};
    };
    
    return Stopwatch;
});
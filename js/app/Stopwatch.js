/*
 * 
 * Module: Stopwatch
 * 
 * Created By: Giulia Alfonsi
 * 
 */
define(function() {

    var Stopwatch = function() {
	var startAt = 0;
	var lapTime = 0;

	var now = function() {
	    return (new Date()).getTime();
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
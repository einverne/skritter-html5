/*
 * 
 * Module: Timer
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Stopwatch',
    'backbone'
], function(Stopwatch) {
    var Skritter = window.skritter;
    
    var TimerView = Backbone.View.extend({
	
	initialize: function() {
	    TimerView.stopwatch = new Stopwatch;
	    TimerView.timer;
	    
	    TimerView.display = '0:00';
	    TimerView.lap = 0;
	    TimerView.reviewTime = 0;
	    TimerView.reviewLimit = 30000;
	    TimerView.thinkingTime = 0;
	    TimerView.thinkingLimit = 15000;
	},
	
	render: function() {
	    this.$el.html(TimerView.display);
	    return this;
	},
		
	getReviewTime: function() {
	    var time = new Date().getTime() - TimerView.lap;
	    if (time >= TimerView.reviewLimit)
		return TimerView.reviewLimit / 1000;
	    return time / 1000;
	},
		
	getThinkingTime: function() {
	    var time = new Date().getTime() - TimerView.lap;
	    if (time >= TimerView.thinkingLimit)
		return TimerView.thinkingLimit / 1000;
	    return time / 1000;
	},
	
	setReviewLimit: function(milliseconds) {
	    TimerView.reviewLimit = milliseconds;
	},
		
	setThinkingLimit: function(milliseconds) {
	    TimerView.thinkingLimit = milliseconds;
	},

	start: function() {
	    TimerView.lap = new Date().getTime();
	    TimerView.timer = window.setInterval(_.bind(this.update, this), 1);
	    TimerView.stopwatch.start();
	},
		
	stop: function() {
	    window.clearInterval(TimerView.timer);
	    TimerView.stopwatch.stop();
	},
		
	update: function() {
	    var time = TimerView.stopwatch.time();
	    var lap = new Date().getTime() - TimerView.lap;
	    var h = m = s = ms = 0;
	    var newDisplay;

	    //split the time out into the proper units
	    h = Math.floor(time / (Math.pow(60, 2) * 1000));
	    time = time % (Math.pow(60, 2) * 1000);
	    m = Math.floor(time / (60 * 1000));
	    time = time % (60 * 1000);
	    s = Math.floor(time / 1000);
	    ms = time % 1000;

	    //format things a little differently if we pass the hour mark
	    if (h > 0) {
		newDisplay = h + ':' + Skritter.fn.zeroPad(m, 2) + ':' + Skritter.fn.zeroPad(s, 2);
	    } else {
		newDisplay = m + ':' + Skritter.fn.zeroPad(s, 2);
	    }
	    
	    //only render if the second has changed
	    if (TimerView.display !== newDisplay) {
		
		//stop the timer if it reaches the review limit
		if (lap >= TimerView.reviewLimit)
		    this.stop();
		
		TimerView.display = newDisplay;
		this.render();
	    }
	}
    });
    
    return TimerView;
});
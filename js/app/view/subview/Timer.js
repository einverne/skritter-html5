/*
 * 
 * Module: Timer
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'backbone'
], function() {
    
    var TimerView = Backbone.View.extend({
	
	initialize: function() {
	    TimerView.timer;
	    TimerView.counter = 0;
	    TimerView.display = '0:00';
	    TimerView.lapCounter = 0;
	    TimerView.limit = 30;
	},
	
	render: function() {
	    this.$el.html(TimerView.display);
	    return this;
	},
		
	setLimit: function(seconds) {
	    TimerView.limit = seconds;
	},
		
	start: function() {
	    if (!TimerView.timer)
		TimerView.timer = setInterval(_.bind(this.update, this), 1000);
	},
		
	stop: function() {
	    if (TimerView.timer) {
		clearInterval(TimerView.timer);
		TimerView.timer = false;
		TimerView.limit = 30;
	    }
	},
		
	update: function() {
	    if (TimerView.lapCounter >= TimerView.limit) {
		TimerView.lapCounter = 0;
		this.stop();
		return;
	    }
		
    
	    TimerView.counter += 1000;
	    TimerView.lapCounter += 1;
	    var time = TimerView.counter;
	    
	    h = Math.floor(time / (Math.pow(60, 2) * 1000));
	    time = time % (Math.pow(60, 2) * 1000);
	    m = Math.floor(time / (60 * 1000));
	    time = time % (60 * 1000);
	    s = Math.floor(time / 1000);
	    //ms = time % 1000;
	    
	    TimerView.display = m + ':' + zeroPad(s, 2);
	    this.render();
	}
	
    });
    
    return TimerView;
});
/*
 * 
 * View: Timer
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Stopwatch',
    'backbone'
], function(Stopwatch) {

    var TimerView = Backbone.View.extend({
        initialize: function() {
            TimerView.stopwatch = new Stopwatch();
            TimerView.time = 1;
            TimerView.timer = null;
            TimerView.display = '0:00';
            TimerView.lap = null;
            TimerView.lapStart = 0;
            TimerView.lapStop = 0;
            TimerView.offset = 0;
            TimerView.reviewTime = 0;
            TimerView.reviewLimit = 30;
            TimerView.thinkingTime = 0;
            TimerView.thinkingLimit = 15;
        },
        render: function() {
            //get the current time and apply the offset
            var time = TimerView.stopwatch.time();
            time += TimerView.offset + 1000;

            //break the time into units for display
            var h = 0;
            var m = 0;
            var s = 0;
            var ms = 0;
            h = Math.floor(time / (Math.pow(60, 2) * 1000));
            time = time % (Math.pow(60, 2) * 1000);
            m = Math.floor(time / (60 * 1000));
            time = time % (60 * 1000);
            s = Math.floor(time / 1000);
            ms = time % 1000;

            //change the display for hours if needed
            if (h > 0) {
                this.$el.html(h + ':' + Skritter.fn.pad(m, 0, 2) + ':' + Skritter.fn.pad(s, 0, 2));
            } else {
                this.$el.html(m + ':' + Skritter.fn.pad(s, 0, 2));
            }

            return this;
        },
        getTime: function() {
            return TimerView.stopwatch.time();
        },
        getReviewTime: function() {
            var time = TimerView.lapStop - TimerView.lapStart;
            if (time >= TimerView.reviewLimit)
                return TimerView.reviewLimit / 1000;
            return time / 1000;
        },
        getThinkingTime: function() {
            var time = TimerView.lapStop - TimerView.lapStart;
            if (time >= TimerView.thinkingLimit)
                return TimerView.thinkingLimit / 1000;
            return time / 1000;
        },
        pause: function() {
            window.clearInterval(TimerView.timer);
            TimerView.lapStop = new Date().getTime();
            TimerView.stopwatch.stop();
        },
        setReviewLimit: function(milliseconds) {
            TimerView.reviewLimit = milliseconds;
        },
        setThinkingLimit: function(milliseconds) {
            TimerView.thinkingLimit = milliseconds;
        },
        setOffset: function(time) {
            TimerView.offset = time * 1000;
        },
        start: function() {
            //console.log('START', TimerView.lap);
            if (!TimerView.lap) {
                TimerView.lap = 1000;
                TimerView.lapStart = new Date().getTime();
            }
            if (TimerView.lap !== TimerView.reviewLimit) {
                TimerView.timer = window.setInterval(_.bind(this.update, this), 10);
                TimerView.stopwatch.start();
            }
        },
        stop: function() {
            TimerView.lap = null;
            TimerView.lapStop = new Date().getTime();
            window.clearInterval(TimerView.timer);
            TimerView.stopwatch.stop();
        },
        update: function() {
            var time = TimerView.stopwatch.time();
            var seconds = Math.floor(time / 1000);
            //only check and update things when a full second has elapsed
            if (TimerView.time !== seconds) {
                TimerView.time = seconds;
                if (TimerView.lap >= TimerView.reviewLimit) {
                    this.pause();
                } else {
                    TimerView.lap += 1000;
                }
                this.render();
            }
        }
    });

    return TimerView;
});
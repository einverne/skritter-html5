/**
 * @module Skritter
 * @submodule Component
 * @param Stopwatch
 * @author Joshua McFarland
 */
define([
    'Stopwatch',
    'backbone'
], function(Stopwatch) {
    /**
     * @class Timer
     */
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
            TimerView.startTime = 0;
            TimerView.thinkingTime = 0;
            TimerView.thinkingLimit = 15;
        },
        /**
         * @method render
         * @return {Timer}
         */
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
        /**
         * Returns the current time displayed on the timer.
         * 
         * @method getTime
         * @return {Number}
         */
        getTime: function() {
            return TimerView.stopwatch.time();
        },
        /**
         * Returns the review time for the current lap.
         * 
         * @method getReviewTime
         * @return {Number}
         */
        getReviewTime: function() {
            var time = TimerView.lapStop - TimerView.lapStart;
            if (time >= TimerView.reviewLimit)
                return TimerView.reviewLimit / 1000;
            return time / 1000;
        },
        /**
         * Returns the time that the current lap was started at.
         * 
         * @method getStartTime
         * @return {Number}
         */
        getStartTime: function() {
            return TimerView.startTime;
        },
        /**
         * Returns the thinking time for the current lap.
         * 
         * @method getThinkingTime
         * @return {Number}
         */
        getThinkingTime: function() {
            var time = TimerView.lapStop - TimerView.lapStart;
            if (time >= TimerView.thinkingLimit)
                return TimerView.thinkingLimit / 1000;
            return time / 1000;
        },
        /**
         * Stops the timer but maintains the current lap. This is useful if the user opens the info tab or
         * if they leave the study page.
         * 
         * @method pause
         */
        pause: function() {
            window.clearInterval(TimerView.timer);
            TimerView.lapStop = new Date().getTime();
            TimerView.stopwatch.stop();
        },
        /**
         * Sets the review limit for the current lap.
         * 
         * @method setReviewLimit
         * @param {Number} milliseconds
         */
        setReviewLimit: function(milliseconds) {
            TimerView.reviewLimit = milliseconds;
        },
        /**
         * Sets the thinking limit for the current lap.
         * 
         * @method setThinkingLimit
         * @param {number} milliseconds
         */
        setThinkingLimit: function(milliseconds) {
            TimerView.thinkingLimit = milliseconds;
        },
        /**
         * Directly set the offset for the timer. This is a bit redundant and probably won't be directly needed.
         * 
         * @method setOffset
         * @param {Number} offsetBy
         */
        setOffset: function(offsetBy) {
            TimerView.offset = offsetBy * 1000;
        },
        /**
         * Starts the timer if the lap limit hasn't been reached yet.
         * 
         * @method start
         */
        start: function() {
            //console.log('START', TimerView.lap);
            if (!TimerView.lap) {
                TimerView.lap = 1000;
                TimerView.lapStart = new Date().getTime();
            }
            if (TimerView.lap !== TimerView.reviewLimit) {
                TimerView.timer = window.setInterval(_.bind(this.update, this), 10);
                TimerView.startTime = Skritter.fn.getUnixTime();
                TimerView.stopwatch.start();
            }
        },
        /**
         * Stops the timer from running and resets the current lap.
         * 
         * @method stop
         */
        stop: function() {
            TimerView.lap = null;
            TimerView.lapStop = new Date().getTime();
            window.clearInterval(TimerView.timer);
            TimerView.stopwatch.stop();
        },
        /**
         * Updates the offset based on the gathered total study time for the day.
         * 
         * @method sync
         * @param {Boolean} includeServer
         */
        sync: function(includeServer) {
            TimerView.offset = Skritter.study.reviews.getTime();
            if (includeServer) {
                Skritter.api.getProgressStats({
                    start: Skritter.settings.get('date')
                }, function(data) {
                    TimerView.offset += data[0].timeStudied.day * 1000;
                });
            }
        },
        /**
         * Bound to setInterval when the timer is running, but only allows render to be called
         * if a full second has passed.
         * 
         * @method update
         */
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
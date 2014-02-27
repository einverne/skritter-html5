/**
 * @module Skritter
 * @submodule Views
 * @author Joshua McFarland
 */
define(function() {
    /**
     * Used to start, stop and calculate accurate durations of time.     
     * 
     * @class Stopwatch
     * @param {Number} offset
     */
    var Stopwatch = function(offset) {
        offset = (offset) ? offset : 0;
        var startAt = 0;
        var lapTime = 0 + offset;
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
    /**
     * @class Timer
     */
    var Timer = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Timer.interval = null;
            Timer.getLapTime = function() {
                return Timer.lapStartAt ? Timer.lapTime + skritter.fn.getUnixTime(true) - Timer.lapStartAt : Timer.lapTime;
            };
            Timer.lapStartAt = 0;
            Timer.lapTime = 0;
            Timer.reviewLimit = 30;
            Timer.reviewStart = null;
            Timer.reviewStop = null;
            Timer.offset = 0;
            Timer.stopwatch = new Stopwatch();
            Timer.thinkingLimit = 15;
            Timer.thinkingStop = null;
            Timer.time = 0;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            var time = (time) ? time : Timer.time;
            //adjusts the rendered time for the offset
            time += Timer.offset;
            //switched to bitwise operations for better performance across browsers
            var hours = (time / (3600 * 1000)) >> 0;
            time = time % (3600 * 1000);
            var minutes = (time / (60 * 1000)) >> 0;
            time = time % (60 * 1000);
            var seconds = (time / 1000) >> 0;
            //var milliseconds = time % 1000;
            if (hours > 0) {
                this.$el.html(hours + ':' + skritter.fn.pad(minutes, 0, 2) + ':' + skritter.fn.pad(seconds, 0, 2));
            } else {
                this.$el.html(minutes + ':' + skritter.fn.pad(seconds, 0, 2));
            }
            return this;
        },
        /**
         * @method getReviewTime
         * @returns {Number}
         */
        getReviewTime: function() {
            var lapTime = Timer.getLapTime() / 1000;
            if (lapTime >= Timer.reviewLimit)
                return Timer.reviewLimit;
            return lapTime;
        },
        /**
         * @method getStartTime
         * @returns {Number}
         */
        getStartTime: function() {
            return parseInt(Timer.reviewStart / 1000, 10);
        },
        /**
         * @method getThinkingTime
         * @returns {Number}
         */
        getThinkingTime: function() {
            var lapTime = Timer.getLapTime() / 1000;
            if (Timer.thinkingStop) {
                var thinkingTime = (Timer.thinkingStop - Timer.reviewStart) / 1000;
                if (thinkingTime >= Timer.thinkingLimit)
                    return Timer.thinkingLimit;
                return thinkingTime;
            }
            if (lapTime >= Timer.thinkingLimit)
                return Timer.thinkingLimit;
            return lapTime;
        },
        /**
         * @method isReviewLimitReached
         * @returns {Boolean}
         */
        isReviewLimitReached: function() {
            if (Timer.getLapTime() >= Timer.reviewLimit * 1000)
                return true;
            return false;
        },
        /**
         * @method isRunning
         * @returns {Boolean}
         */
        isRunning: function() {
            if (Timer.interval)
                return true;
            return false;
        },
        /**
         * @method isThinkingLimitReached
         * @returns {Boolean}
         */
        isThinkingLimitReached: function() {

        },
        /**
         * @method reset
         * @returns {Backbone.View}
         */
        reset: function() {
            if (!this.isRunning()) {
                Timer.lapStartAt = 0;
                Timer.lapTime = 0;
                Timer.reviewStart = null;
                Timer.reviewStop = null;
                Timer.thinkingStop = null;
            }
            return this;
        },
        /**
         * @method setReviewLimit
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setReviewLimit: function(value) {
            Timer.reviewLimit = value;
            return this;
        },
        /**
         * @method setOffset
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setOffset: function(value) {
            Timer.offset = value;
            return this;
        },
        /**
         * @method setThinkingLimit
         * @param {Number} value
         * @returns {Backbone.View}
         */
        setThinkingLimit: function(value) {
            Timer.thinkingLimit = value;
            return this;
        },
        /**
         * @method start
         */
        start: function() {
            if (!Timer.reviewStart)
                Timer.reviewStart = skritter.fn.getUnixTime(true);
            if (!this.isRunning() && !this.isReviewLimitReached()) {
                Timer.interval = setInterval(this.update, 10, this);
                Timer.lapStartAt = Timer.lapStartAt ? Timer.lapStartAt : skritter.fn.getUnixTime(true);
                Timer.stopwatch.start();
            }
        },
        /**
         * @method stop
         */
        stop: function() {
            if (this.isRunning()) {
                Timer.lapTime = Timer.lapStartAt ? Timer.lapTime + skritter.fn.getUnixTime(true) - Timer.lapStartAt : Timer.lapTime;
                Timer.lapStartAt = 0;
                Timer.reviewStop = skritter.fn.getUnixTime(true);
                Timer.stopwatch.stop();
                clearInterval(Timer.interval);
                Timer.interval = null;
            }
        },
        /**
         * @method stopThinking
         * @returns {Backbone.View}
         */
        stopThinking: function() {
            if (!Timer.thinkingStop)
                Timer.thinkingStop = skritter.fn.getUnixTime(true);
            return this;
        },
        /**
         * Updates the offset based on the gathered total study time for the day.
         * 
         * @method sync
         * @param {Boolean} includeServer
         */
        sync: function(includeServer) {
            Timer.offset = skritter.data.reviews.getTotalTime();
            if (includeServer) {
                skritter.api.getProgressStats({
                    start: skritter.settings.get('date')
                }, function(data) {
                    Timer.offset += data[0].timeStudied.day * 1000;
                });
            }
        },
        /**
         * @method update
         * @param {Backbone.View} self
         */
        update: function(self) {
            //get the new time to check in milliseconds and seconds
            var time = Timer.stopwatch.time();
            var seconds = (time / 1000) >> 0;
            //only check and update things when a full second has elapsed
            if ((Timer.time / 1000) >> 0 !== seconds) {
                Timer.time = time;
                self.render();
                //stop the review timer if exceeds the set limit
                if (self.isReviewLimitReached())
                    self.stop();
            }
        }
    });

    return Timer;
});
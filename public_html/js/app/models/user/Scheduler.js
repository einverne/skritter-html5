/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class UserScheduler
     */
    var Scheduler = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Scheduler.this = this;
            Scheduler.daysInSecond = 1 / 86400;
            Scheduler.schedule = [];
        },
        /**
         * @method count
         * @returns {Number}
         */
        count: function() {
            return Scheduler.schedule.length;
        },
        /**
         * @method due
         * @returns {Array}
         */
        due: function() {
            return Scheduler.schedule.filter(function(item) {
                if (item.readiness >= 1.0)
                    return true;
                return false;
            });
        },
        /**
         * @method dueCount
         * @returns {Number}
         */
        dueCount: function() {
            return this.due().length;
        },
        /**
         * @method filter
         * @param {Object} attributes
         * @returns {Backbone.Model}
         */
        filter: function(attributes) {
            var parts = (attributes && attributes.parts) ? attributes.parts : skritter.user.settings.activeParts();
            var styles = (attributes && attributes.styles) ? attributes.styles : skritter.user.settings.style();
            var ids = (attributes && attributes.ids) ? attributes.ids : null;
            var filteredSchedule = Scheduler.schedule.filter(function(item) {
                if (item.vocabIds.length === 0)
                    return false;
                if (ids) {
                    if (!_.contains(ids, item.id))
                        return false;
                } else {
                    if (!_.contains(parts, item.part))
                        return false;
                    if (styles.length > 0 && !_.contains(styles, item.style))
                        return false;
                }
                return true;
            });
            Scheduler.schedule = filteredSchedule;
            return this;
        },
        /**
         * Returns a calculated interval based on the grade and other details about the item.
         * 
         * @method getInterval
         * @param {StudyItem} item
         * @param {Number} grade
         * @returns {Number}
         */
        getInterval: function(item, grade) {
            var config = skritter.user.data.srsconfigs.findWhere({part: item.get('part')});
            var newInterval;
            var getRandomizedInterval = function(interval) {
                return Math.round(interval * (0.925 + (Math.random() * 0.15)));
            };
            //return new items with randomized default config values
            if (!item.has('last')) {
                switch (grade) {
                    case 1:
                        newInterval = config.get('initialWrongInterval');
                        break;
                    case 2:
                        newInterval = config.get('initialRightInterval') / 5;
                        break;
                    case 3:
                        newInterval = config.get('initialRightInterval');
                        break;
                    case 4:
                        newInterval = config.get('initialRightInterval') * 4;
                        break;
                }
                return getRandomizedInterval(newInterval);
            }
            //set values for further calculations
            var actualInterval = skritter.fn.getUnixTime() - item.get('last');
            var factor;
            var pctRight = item.get('successes') / item.get('reviews');
            var scheduledInterval = item.get('next') - item.get('last');
            //get the factor 
            if (grade === 2) {
                factor = 0.9;
            } else if (grade === 4) {
                factor = 3.5;
            } else {
                var factorsList = (grade === 1) ? config.get('wrongFactors') : config.get('rightFactors');
                var divisions = [2, 1200, 18000, 691200];
                var index;
                for (var i in divisions)
                {
                    if (item.get('interval') > divisions[i]) {
                        index = i;
                    }
                }
                factor = factorsList[index];
            }
            //adjust the factor based on readiness
            if (grade > 2) {
                factor -= 1;
                factor *= actualInterval / scheduledInterval;
                factor += 1;
            }
            //accelerate new items that appear to be known
            if (item.get('successes') === item.get('reviews') && item.get('reviews') < 5) {
                factor *= 1.5;
            }
            //decelerate hard items consistently marked wrong
            if (item.get('reviews') > 8) {
                if (pctRight < 0.5)
                    factor *= Math.pow(pctRight, 0.7);
            }
            //multiple by the factor and randomize the interval
            newInterval = getRandomizedInterval(item.get('interval') * factor);
            //bound the interval
            if (grade === 1) {
                if (newInterval > 604800) {
                    newInterval = 604800;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            } else {
                if (newInterval > 315569260) {
                    newInterval = 315569260;
                } else if (grade === 2 && newInterval < 300) {
                    newInterval = 300;
                } else if (newInterval < 30) {
                    newInterval = 30;
                }
            }
            return newInterval;
        },
        /**
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            skritter.storage.getSchedule(function(schedule) {
                Scheduler.schedule = schedule;
                Scheduler.this.filter();
                Scheduler.this.sort();
                callback();
            });
        },
        /**
         * @method next
         * @param {function} callback
         */
        next: function(callback) {
            var index = 0;
            function load() {
                skritter.user.data.loadItem(Scheduler.schedule[index].id, function(item) {
                    if (item) {
                        console.log(item);
                        callback(item);
                    } else {
                        index++;
                        load();
                    }
                });
            }
            load();
        },
        /**
         * @method schedule
         * @returns {Array}
         */
        schedule: function() {
            return Scheduler.schedule;
        },
        /**
         * @method sort
         * @returns {Backbone.Model}
         */
        sort: function() {
            var now = skritter.fn.getUnixTime();
            //sort the schedule based on readiness value
            var sortedSchedule = _.sortBy(Scheduler.schedule, function(item) {
                if (item.held && item.held > now) {
                    item.readiness = 0.5 + (now / item.held) * 0.1;
                    return -item.readiness;
                }
                if (!item.last && (item.next - now) > 600) {
                    item.readiness = 0.2;
                    return -item.readiness;
                }
                if (!item.last || (item.next - item.last) === 1) {
                    item.readiness = 99999999;
                    return -item.readiness;
                }
                var seenAgo = now - item.last;
                var rtd = item.next - item.last;
                var readiness = seenAgo / rtd;
                if (readiness > 0 && seenAgo > 9000) {
                    var dayBonus = 1;
                    var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * Scheduler.daysInSecond);
                    var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                    ageBonus *= readiness2 * readiness2;
                    readiness += ageBonus;
                }
                item.readiness = readiness;
                return -item.readiness;
            });
            Scheduler.schedule = sortedSchedule;
            return this;
        },
        /**
         * @method update
         * @param {Backbone.Model} item
         * @param {Function} callback
         * @returns {Backbone.Model}
         */
        update: function(item, callback) {
            if (typeof callback === 'function')
                callback();
        }
    });

    return Scheduler;
});
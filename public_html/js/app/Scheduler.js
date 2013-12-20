/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * A group of functions that can be used for scheduling items.
     * 
     * @class Scheduler
     */
    function Scheduler() {
        this.history = [];
        this.schedule = [];
    }
    
    /**
     * @method getDue
     * @returns {Array}
     */
    Scheduler.prototype.getDue = function() {
        var activeParts = skritter.user.getActiveStudyParts();
        return this.sort().filter(function(item) {
            if (_.contains(activeParts, item.part) && item.readiness >= 1.0)
                return true;
            return false;
        });
    };
    
    /**
     * @method getDueCount
     * @returns {Number}
     */
    Scheduler.prototype.getDueCount = function() {
        return this.getDue().length;
    };
    
    /**
     * Returns a calculated interval based on the grade and other details about the item.
     * 
     * @method getInterval
     * @param {StudyItem} item
     * @param {Number} grade
     * @returns {Number}
     */
    Scheduler.prototype.getInterval = function(item, grade) {
        var config = skritter.data.srsconfigs.findWhere({lang: skritter.user.getSetting('targetLang'), part: item.get('part')});
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
                    newInterval = config.get('initialRightInterval' * 4);
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

        //console.log('FACTOR', factor);

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
    };
    
    /**
     * @method getNext
     * @param {Function} callback
     */
    Scheduler.prototype.getNext = function(callback) {
        var activeParts = skritter.user.getActiveStudyParts();
        var items = this.sort().filter(function(item) {
            if (_.contains(activeParts, item.part))
                return true;
            return false;
        });
        var position = 0;
        next();
        function next() {            
            var item = items[position];
            skritter.data.items.loadItems(item, false, function() {
                item = skritter.data.items.findWhere({id: item.id});
                if (item.checkIntegrity()) {
                    callback(item);
                } else {
                    console.log(item, 'failed an integrity check');
                    position++;
                    next();
                }
            });
        }
    };
    
    /**
     * @method sort
     * @returns {Array}
     */
    Scheduler.prototype.sort = function() {
        var now = skritter.fn.getUnixTime();
        this.schedule = _.sortBy(this.schedule, function(item) {
            if (item.vocabIds.length === 0) {
                item.readiness = 0;
                return -item.readiness;
            }
            if (!item.last && (item.next - now) > 600) {
                item.readiness = 0.2;
                return -item.readiness;
            }
            if (!item.last || (item.next - item.last) === 1) {
                item.readiness = 90019001;
                return -item.readiness;
            }
            var seenAgo = now - item.last;
            var rtd = item.next - item.last;
            var readiness = seenAgo / rtd;
            if (readiness > 0 && seenAgo > 9000) {
                var dayBonus = 1;
                var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * (1 / 86400));
                var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                ageBonus *= readiness2 * readiness2;
                readiness += ageBonus;
            }
            item.readiness = readiness;
            return -item.readiness;
        });
        return this.schedule;
    };
    
    /**
     * @method updateItem
     * @param {Object} item
     */
    Scheduler.prototype.updateItem = function(item) {
        var id = item.get('id');
        this.schedule[_.findIndex(this.schedule, {id: id})] = {
            id: id,
            last: item.get('last'),
            next: item.get('next'),
            part: item.get('part'),
            vocabIds: item.get('vocabIds')
        };
    };
    
    return Scheduler;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Scheduler
     */
    var Scheduler = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Scheduler.this = this;
            Scheduler.schedule = [];
        },
        /**
         * @method filter
         * @param {Object} attributes
         * @returns {Backbone.Model}
         */
        filter: function(attributes) {
            var parts = (attributes && attributes.parts) ? attributes.parts : skritter.user.getActiveParts();
            var styles = (attributes && attributes.styles) ? attributes.styles : skritter.user.getStyle();
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
         * @method getDue
         * @returns {Array}
         */
        getDue: function() {
            return Scheduler.schedule.filter(function(item) {
                if (item.readiness >= 1.0)
                    return true;
                return false;
            });
        },
        /**
         * @method getDueCount
         * @returns {Number}
         */
        getDueCount: function() {
            return this.getDue().length;
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
            var config = skritter.data.srsconfigs.findWhere({part: item.get('part')});
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
         * @method getItemCount
         * @returns {Number}
         */
        getItemCount: function() {
            return Scheduler.schedule.length;
        },
        /**
         * @method getNext
         * @param {Function} callback
         * @param {String} id
         */
        getNext: function(callback, id) {
            loadItem();
            function loadItem() {
                var item = null;
                //return nothing when no items have been loaded into the scheduler
                if (Scheduler.this.getItemCount() === 0) {
                    callback();
                    return;
                } else {
                    if (id) {
                        item = _.find(Scheduler.schedule, {id: id});
                        if (!item) {
                            callback();
                            return;
                        }
                    } else {
                        item = Scheduler.schedule[0];
                    }
                }
                async.waterfall([
                    //load the base item
                    function(callback) {
                        skritter.data.items.load(item.id, function(item) {
                            if (item) {
                                callback(null, item);
                            } else {
                                callback("Base item doesn't exist.", null, null, []);
                            }
                        });
                    },
                    //load the associated vocab
                    function(item, callback) {
                        skritter.data.vocabs.load(item.getVocabId(), function(vocab) {
                            if (vocab) {
                                callback(null, item, vocab);
                            } else {
                                callback("Associated vocab doesn't exist.", null, null, []);
                            }
                        });
                    },
                    //load contained items for rune and tone
                    function(item, vocab, callback) {
                        var part = item.get('part');
                        if (part === 'rune' || part === 'tone') {
                            vocab.loadContainedItems(part, function(containedItems) {
                                callback(null, item, vocab, containedItems);
                            });
                        } else {
                            callback(null, item, vocab, []);
                        }
                    },
                    //load contained item vocabs
                    function(item, vocab, containedItems, callback) {
                        if (containedItems) {
                            var containedVocabIds = [];
                            for (var i in containedItems)
                                containedVocabIds.push(containedItems[i].getVocabId());
                            skritter.data.vocabs.load(containedVocabIds, function(containedVocabs) {
                                callback(null, item, vocab, containedItems, containedVocabs);
                            });
                        } else {
                            callback(null, item, vocab, containedItems);
                        }
                    },
                    //check for missing data and other possible errors
                    function(item, vocab, contained, containedVocabs, callback) {
                        var error = null;
                        if (item.get('part') === 'rune') {
                            var characters = vocab.getCharacters();
                            for (var i in characters)
                                if (!skritter.data.strokes.get(characters[i]))
                                    error = "Missing stroke data.";
                        }
                        callback(error, item, vocab, contained);
                    }
                ], function(error, item, vocab, containedItems, containedVocabs) {
                    if (error) {
                        skritter.log.console(error, item);
                        Scheduler.this.remove(item.id);
                        loadItem();
                    } else {
                        callback(item, vocab, containedItems, containedVocabs);
                    }
                });
            }
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getSchedule(function(schedule) {
                Scheduler.schedule = schedule;
                Scheduler.this.filter();
                Scheduler.this.sort();
                callback();
            });
        },
        /**
         * @method remove
         * @param {String} id
         * @returns {Backbone.Model}
         */
        remove: function(id) {
            var index = _.findIndex(this.get('schedule'), {id: id});
            if (index > -1)
                Scheduler.schedule.splice(index, 1);
            return this;
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
            var daysInSecond = 1 / 86400;
            //sort the schedule based on readiness value
            var sortedSchedule = _.sortBy(Scheduler.schedule, function(item) {
                if (item.held && item.held > now) {
                    item.readiness = 0.9 + (now / item.held) * 0.1;
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
                    var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * daysInSecond);
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
         * @returns {Backbone.Model}
         */
        update: function(item) {
            var now = skritter.fn.getUnixTime();
            var id = item.get('id');
            var splitId = id.split('-');
            var condensedItem = {
                base: splitId[1] + '-' + splitId[2] + '-' + splitId[3],
                held: item.get('held'),
                id: id,
                last: item.get('last'),
                next: item.get('next'),
                part: item.get('part'),
                style: item.get('style'),
                vocabIds: item.get('vocabIds')
            };
            //updates the the direct item
            var index = _.findIndex(Scheduler.schedule, {id: id});
            Scheduler.schedule[index] = condensedItem;
            //updates indirect related items
            var relatedItemIds = item.getRelatedItemIds();
            for (var i in relatedItemIds) {
                var relatedIndex = _.findIndex(Scheduler.schedule, {id: relatedItemIds[i]});
                if (relatedIndex > -1) {
                    var relatedItem = Scheduler.schedule[relatedIndex];
                    relatedItem.held = now + 4 * 60 * 60;
                    Scheduler.schedule[index] = relatedItem;
                }
            }
            Scheduler.this.sort();
            return this;
        }
    });

    return Scheduler;
}); 
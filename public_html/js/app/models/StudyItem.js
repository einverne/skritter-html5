/**
 * @module Skritter
 * @submodule Model
 * @param StudyReview
 * @author Joshua McFarland
 */
define([
    'models/StudyReview',
    'backbone'
], function(StudyReview) {
    /**
     * @class StudyItem
     */
    var StudyItem = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method checkIntegiry
         * @returns {Boolean}
         */
        checkIntegrity: function() {
            var characterCount = this.getCharacterCount();
            var contained = this.getContained();
            var part = this.get('part');
            if (_.contains(['rune', 'tone'], part) && characterCount > 1 && contained.length < characterCount) {
                this.set({
                    flag: true,
                    flagMessage: "The contained items for this character don't exist.",
                    vocabIds: []
                });
                skritter.scheduler.updateItem(this);
                return false;
            }
            if (part === 'rune' && this.get('vocabIds').length > 0) {
                var characters = this.getVocabs()[0].getCharacters();
                for (var i in characters) {
                    if (!skritter.data.strokes.findWhere({rune: characters[i]})) {
                        this.set({
                           flag: true ,
                           flagMessage: "This item doesn't have the required stroke data.",
                           vocabIds: []
                        });
                        skritter.scheduler.updateItem(this);
                        return false;
                    }
                }
            }
            return true;
        },
        /**
         * @method getCharacterCount
         * @returns {Number}
         */
        getCharacterCount: function() {
            if (this.get('vocabIds').length > 0)
                return this.getVocabs()[0].getCharacterCount();
            return 0;
        },
        /**
         * Returns the contained items for multi-character words. Data is stored for
         * the contained characters regardsless of whether they are being studied or not.
         * 
         * @method getContained
         * @return {Array}
         */
        getContained: function() {
            var items = [];
            if (this.get('vocabIds').length > 0) {
                var contained = this.getVocabs()[0].get('containedVocabIds');
                for (var i in contained) {
                    var id = skritter.user.get('user_id') + '-' + contained[i] + '-' + this.get('part');
                    var item = skritter.data.items.findWhere({id: id});
                    if (item)
                        items.push(item);
                }
            }
            return items;
        },
        /**
         * Returns the contained items for multi-character words. Data is stored for
         * the contained characters regardsless of whether they are being studied or not.
         * 
         * @method getContainedIds
         * @return {Array}
         */
        getContainedIds: function() {
            var items = [];
            if (this.get('vocabIds').length > 0) {
                var contained = this.getVocabs()[0].get('containedVocabIds');
                for (var i in contained) {
                    var id = skritter.user.get('user_id') + '-' + contained[i] + '-' + this.get('part');
                    if (id)
                        items.push(id);
                }
            }
            return items;
        },
        /**
         * @method getReadiness
         * @param {Boolean} deprioritizeLongShots
         * @return {Number}
         */
        getReadiness: function(deprioritizeLongShots) {
            var now = skritter.fn.getUnixTime();
            if (!this.has('last') && (this.get('next') - now) > 600)
                return 0.2;
            if (!this.has('last') || (this.get('next') - this.get('last')) === 1)
                return 90019001;
            var lengthPenalty = (this.getCharacterCount() > 1) ? 0 : -0.02;
            var seenAgo = now - this.get('last');
            var rtd = this.get('next') - this.get('last');
            var readiness = seenAgo / rtd;
            if (readiness > 0 && seenAgo > 9000) {
                var dayBonus = 1;
                var ageBonus = 0.1 * Math.log(dayBonus + (dayBonus * dayBonus * seenAgo) * (1 / 86400));
                var readiness2 = (readiness > 1) ? 0.0 : 1 - readiness;
                ageBonus *= readiness2 * readiness2;
                readiness += ageBonus;
            }
            if (deprioritizeLongShots) {
                if (readiness > 2.5 && rtd > 600) {
                    if (readiness > 20) {
                        readiness = 1.5;
                    } else {
                        readiness = 3.5 - Math.pow(readiness * 0.4, 0.33333);
                    }
                }
                if (lengthPenalty && readiness > 1)
                    readiness = Math.pow(readiness, 1 + lengthPenalty);
            }
            return readiness;
        },
        /**
         * Attempts to load all resources required to study a specific item.
         * 
         * @method callback
         * @param {Function} callback
         */
        loadResources: function(callback) {
            var self = this;
            var vocabIds = _.clone(this.get('vocabIds'));
            if (vocabIds.length > 0) {
                skritter.async.waterfall([
                    //load the initial item vocabs
                    function(callback) {
                        skritter.storage.getItems('vocabs', vocabIds, function(vocabs) {
                            callback(null, skritter.data.vocabs.add(vocabs, {merge: true, silent: true, sort: false}));
                        });
                    },
                    //load the contained vocabs
                    function(vocabs, callback) {
                        var containedVocabIds = [];
                        for (var i in vocabs)
                            containedVocabIds = containedVocabIds.concat(vocabs[i].get('containedVocabIds'));
                        skritter.storage.getItems('vocabs', _.uniq(containedVocabIds), function(containedVocabs) {
                            skritter.data.vocabs.add(containedVocabs, {merge: true, silent: true, sort: false});
                            callback(null, vocabs);
                        });
                    },
                    //load the contained items
                    function(vocabs, callback) {
                        skritter.storage.getItems('items', self.getContainedIds(), function(items) {
                            skritter.data.items.add(items, {merge: true, silent: true, sort: false});
                            callback(null, vocabs);
                        });
                    },
                    //load the decomps
                    function(vocabs, callback) {
                        skritter.storage.getItems('decomps', vocabs[0].getCharacters(), function(decomps) {
                            skritter.data.decomps.add(decomps, {merge: true, silent: true, sort: false});
                            callback(null, vocabs);
                        });
                    },
                    //load the sentence
                    function(vocabs, callback) {
                        skritter.storage.getItems('sentences', vocabs[0].get('sentenceId'), function(sentence) {
                            skritter.data.sentences.add(sentence, {merge: true, silent: true, sort: false});
                            callback(null, vocabs);
                        });
                    },
                    //load the stroke data
                    function(vocabs, callback) {
                        skritter.storage.getItems('strokes', vocabs[0].getCharacters(), function(strokes) {
                            skritter.data.strokes.add(strokes, {merge: true, silent: true, sort: false});
                            callback();
                        });
                    }
                ], function() {
                    callback(self);
                });
            } else {
                callback(self);
            }
        },
        /**
         * @method getVocabs
         * @return {Array}
         */
        getVocabs: function() {
            var containedVocabs = [];
            var containedIds = this.get('vocabIds');
            for (var i in containedIds)
                containedVocabs.push(skritter.data.vocabs.findWhere({id: containedIds[i]}));
            return containedVocabs;
        },
        /**
         * @method isNew
         * @returns {Boolean}
         */
        isNew: function() {
            if (this.has('last'))
                return true;
            return false;
        },
        /**
         * Updates the locally stored item and also spawns a review for it.
         * 
         * @method update
         * @param {Number} grade
         * @param {Number} reviewTime
         * @param {Number} startTime
         * @param {Number} thinkingTime
         * @param {String} wordGroup
         * @param {String} bearTime
         * @returns {Backbone.Model}
         */
        update: function(grade, reviewTime, startTime, thinkingTime, wordGroup, bearTime) {
            console.log('UPDATE', this.get('id'), grade, reviewTime, startTime, thinkingTime, wordGroup, bearTime);
            var review = new StudyReview({
                id: this.get('id') + ':' + startTime,
                itemId: this.get('id'),
                score: grade,
                bearTime: bearTime,
                submitTime: startTime,
                reviewTime: reviewTime,
                thinkingTime: thinkingTime,
                currentInterval: this.has('interval') ? this.get('interval') : 0,
                actualInterval: this.has('last') ? startTime - this.get('last') : 0,
                newInterval: skritter.scheduler.getInterval(this, grade),
                wordGroup: wordGroup,
                previousInterval: this.has('previousInterval') ? this.get('previousInterval') : 0,
                previousSuccess: this.has('previousSuccess') ? this.get('previousSuccess') : false
            });
            this.set({
                changed: startTime,
                last: startTime,
                next: startTime + review.get('newInterval'),
                interval: review.get('newInterval'),
                previousInterval: this.get('interval'),
                previousSuccess: (grade > 1) ? true : false,
                reviews: this.get('reviews') + 1,
                successes: (grade > 1) ? this.get('successes') + 1 : this.get('successes')
            });
            skritter.scheduler.updateItem(this);
            skritter.data.reviews.add(review);
            return this;
        },
        /**
         * @method validate
         * @param {Object} attributes
         */
        validate: function(attributes) {
            if (attributes.changed <= this.get('changed')) {
                console.log('Changed timestamp must be greater than current to update item.');
                return 'Changed timestamp must be greater than current to update item.';
            }
        }
    });

    return StudyItem;
});
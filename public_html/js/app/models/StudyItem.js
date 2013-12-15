/**
 * @module Skritter
 * @submodule Model
 * @param Scheduler
 * @param StudyReview
 * @author Joshua McFarland
 */
define([
    'Scheduler',
    'models/StudyReview',
    'backbone'
], function(Scheduler, StudyReview) {
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
         * Returns the contained items for multi-character words. Data is stored for
         * the contained characters regardsless of whether they are being studied or not.
         * 
         * @method getContained
         * @return {Array}
         */
        getContained: function() {
            var items = [];
            var contained = this.getVocabs()[0].get('containedVocabIds');
            for (var i in contained)
            {
                var id = skritter.user.get('user_id') + '-' + contained[i] + '-' + this.get('part');
                var item = skritter.data.items.findWhere({id: id});
                if (item)
                    items.push(item);
            }
            return items;
        },
        getCharacterCount: function() {
            return this.get('id').match(/[\u4e00-\u9fcc]|[\u3400-\u4db5]|[\u20000-\u2a6d6]|[\u2a700-\u2b734]|[\u2b740-\u2b81d]/g).length;
        },
        /**
         * @method getReadiness
         * @param {Boolean} deprioritizeLongShots
         * @return {Number}
         */
        getReadiness: function(deprioritizeLongShots) {
            var now = skritter.fn.getUnixTime();
            if (!this.get('vocabIds') || this.get('vocabIds').length <= 0)
                return 0;
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
            if (this.get('reviews') < 1 || this.get('successes') < 1)
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
                currentInterval: this.get('interval'),
                actualInterval: (this.get('last')) ? startTime - this.get('last') : 0,
                newInterval: new Scheduler().getInterval(this, grade),
                wordGroup: wordGroup,
                previousInterval: (this.get('previousInterval')) ? this.get('previousInterval') : 0,
                previousSuccess: (this.get('previousSuccess')) ? this.get('previousSuccess') : false
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
            }, {silent: true}).cache();
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
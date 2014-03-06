/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Review
     */
    var Review = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            base: {},
            contained: [],
            part: null,
            position: 1
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('reviews', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method calculate;
         * @returns {Backbone.Model}
         */
        calculate: function() {
            //updates all of the interval values based on the item and score
            for (var i = 0, length = this.get('contained').length + 1; i < length; i++) {
                var item = this.item(i);
                var review;
                if (i === 0) {
                    review = this.get('base');
                } else {
                    review = this.get('contained')[i - 1];
                }
                review.newInterval = skritter.user.scheduler.interval(item, review.score);
            }
            //updates the final grade when contained items exist
            this.get('base').score = this.finalGrade();
            return this;
        },
        /**
         * @method finalGrade
         * @returns {Number}
         */
        finalGrade: function() {
            var grade = 3;
            var max = this.max();
            if (!this.hasContained()) {
                grade = this.get('base').score;
            } else {
                var totalGrade = 0;
                var totalWrong = 0;
                for (var i = 0, length = max; i < length; i++) {
                    var contained = this.get('contained')[i];
                    totalGrade += contained.score;
                    if (contained.score === 1)
                        totalWrong++;
                }
                if (max === 2 && totalWrong === 1) {
                    grade = 1;
                } else if (totalWrong > 1) {
                    grade = 1;
                } else {
                    grade = Math.floor(totalGrade / max);
                }
            }
            return grade;
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            if (this.get('contained').length > 0)
                return true;
            return false;
        },
        /**
         * @method item
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        item: function(position) {
            if (position && this.hasContained())
                return skritter.user.data.items.get(this.get('contained')[position - 1].itemId);
            return skritter.user.data.items.get(this.get('base').itemId);
        },
        /**
         * @method max
         * @returns {Number}
         */
        max: function() {
            if (this.hasContained())
                return this.get('contained').length;
            return 1;
        },
        /**
         * @method position
         * @param {Number} position
         * @returns {Object}
         */
        position: function(position) {
            if (position !== 0 && this.hasContained())
                return this.get('contained')[position - 1];
            return this.get('base');
        },
        /**
         * @method save
         * @returns {Backbone.Model}
         */
        save: function() {
            for (var i = 0, length = this.get('contained').length + 1; i < length; i++) {
                var item = this.item(i);
                var review = this.position(i);
                item.set({
                    changed: review.submitTime,
                    last: review.submitTime,
                    next: review.submitTime + review.newInterval,
                    previousInterval: review.currentInterval,
                    previousSuccess: (review.score > 1) ? true : false,
                    reviews: item.get('reviews') + 1,
                    successes: (review.score > 1) ? item.get('successes') + 1 : item.get('successes')
                });
            }
            console.log(item);
            if (!skritter.user.data.reviews.get(this))
                return skritter.user.data.reviews.add(this);
            this.cache();
            return this;
            return this;
        },
        totalReviewTime: function() {
            
        },
        totalThinkingTime: function() {
            
        },
        /**
         * @method vocab
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        vocab: function(position) {
            return this.item(position).vocab();
        }
    });

    return Review;
});
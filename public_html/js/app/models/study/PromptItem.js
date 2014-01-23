/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class PromptItem
     */
    var PromptItem = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'position',
        /**
         * @property {Object} defaults
         */
        defaults: {
            character: null,
            finished: false,
            item: null,
            position: 0,
            review: null
        },
        /**
         * @method getGrade
         * @returns {Number}
         */
        getGrade: function() {
            return this.get('review').get('score');
        },
        /**
         * @method isFinished
         * @returns {Boolean}
         */
        isFinished: function() {
            if (this.get('finished'))
                return true;
            return false;
        },
        item: function() {
            return this.get('item');
        },
        review: function() {
            return this.get('review');
        },
        setReview: function(grade, reviewTime, thinkingTime, submitTime) {
            var now = skritter.fn.getUnixTime();
            var review = this.review().set({
                score: grade,
                submitTime: submitTime ? submitTime : now,
                reviewTime: reviewTime,
                thinkingTime: thinkingTime,
                currentInterval: (this.item().get('interval')) ? this.item().get('interval') : 0,
                actualInterval: this.item().has('last') ? now - this.item().get('last') : 0,
                newInterval: skritter.scheduler.getInterval(this.item(), grade),
                previousInterval: this.item().has('previousInterval') ? this.item().get('previousInterval') : 0,
                previousSuccess: this.item().has('previousSuccess') ? this.item().get('previousSuccess') : false
            });
            this.item().set({
                changed: now,
                last: now,
                next: now + review.get('newInterval'),
                interval: review.get('newInterval'),
                previousInterval: review.get('currentInterval'),
                previousSuccess: (grade > 1) ? true : false,
                reviews: this.item().get('reviews') + 1,
                successes: (grade > 1) ? this.item().get('successes') + 1 : this.item().get('successes')
            });
        },
        updateReview: function(grade) {
            this.review().set('score', grade);
        }
    });
    
    return PromptItem;
});
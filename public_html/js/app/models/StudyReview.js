/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class StudyReview
     */
    var StudyReview = Backbone.Model.extend({
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
         * @method checkIntegrity
         * @returns {Boolean}
         */
        checkIntegrity: function() {
            var numbers = [
                this.get('actualInterval'),
                this.get('currentInterval'),
                this.get('newInterval'),
                this.get('previousInterval'),
                this.get('reviewTime'),
                this.get('score'),
                this.get('submitTime'),
                this.get('thinkingTime')
            ];
            for (var i in numbers)
                if (!$.isNumeric(numbers[i]))
                    return false;
            return true;
        },
        /**
         * @method comparator
         * @param {Object} review
         * @returns {Number}
         */
        comparator: function(review) {
            return review.get('submitTime');
        }
    });

    return StudyReview;
});
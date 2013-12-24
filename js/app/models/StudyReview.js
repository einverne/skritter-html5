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
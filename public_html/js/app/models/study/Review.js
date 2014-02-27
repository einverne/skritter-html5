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
         * @property {Object} defaults
         */
        defaults: {
            containedReviews: [],
            finished: false
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
        }
    });

    return Review;
});
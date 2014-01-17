/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Review
     */
    var Review = Backbone.Model.extend({
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
        defaults: {
            score: 3,
            bearTime: false,
            submitTime: 0,
            reviewTime: 0,
            thinkingTime: 0,
            currentInterval: 0,
            actualInterval: 0,
            newInterval: 0,
            previousInterval: 0,
            previousSuccess: false
        }
    });

    return Review;
});
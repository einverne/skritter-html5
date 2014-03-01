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
        },
        /**
         * @method hasContained
         * @returns {Boolean}
         */
        hasContained: function() {
            if (this.get('containedReviews').length > 0)
                return true;
            return false;
        },
        /**
         * @method max
         * @returns {Number}
         */
        max: function() {
            var containedLength = this.get('containedReviews').length;
            if (containedLength > 0)
                return containedLength;
            return 1;
        }
    });

    return Review;
});
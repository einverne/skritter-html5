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
         * Gets the object at the specified position in the review. The item returned varies pending
         * the number of contained reviews in the array.
         * 
         * @method at
         * @param {Number} position
         * @returns {Object}
         */
        at: function(position) {
            var maxLength = this.max();
            if (maxLength === 1)
                return this.get('contained')[0];
            return this.get('contained')[position];
        },
        /**
         * Allows for direct access to the item and vocab models from the specified contained item.
         * 
         * @method contained
         * @param {Number} position
         * @returns {}
         */
        contained: function(position) {
            var review = this.at(position);
            return {
                item: function() {
                    return skritter.user.data.items.findWhere({id: review.itemId});
                },
                vocab: function() {
                    return skritter.user.data.items.findWhere({id: review.itemId}).vocab();
                }
            };
        },
        /**
         * Gets and return the base items item data.
         * 
         * @method item
         * @returns {Backbone.Model}
         */
        item: function() {
            return skritter.user.data.items.findWhere({id: this.get('contained')[0].itemId});
        },
        /**
         * Returns the max number of position contained within the review. This varies pending
         * the part and number of contained reviews.
         * 
         * @method max
         * @returns {Number}
         */
        max: function() {
            var containedLength = this.get('contained').length;
            if (containedLength > 1)
                return containedLength - 1;
            return containedLength;
        },
        /**
         * Gets and returns the base items vocab data.
         * 
         * @method vocab
         * @returns {Backbone.Model}
         */
        vocab: function() {
            return skritter.user.data.items.findWhere({id: this.get('contained')[0].itemId}).vocab();
        }
    });

    return Review;
});
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
         * @returns {Object}
         */
        contained: function(position) {
            var self = this;
            var containedReview = this.at(position);
            if (containedReview)
                return {
                    /**
                     * @method contains().item
                     * @returns {Backbone.Model}
                     */
                    item: function() {
                        return skritter.user.data.items.findWhere({id: containedReview.itemId});
                    },
                    /**
                     * @method contains().update
                     * @param {String} attribute
                     * @param {String} value
                     * @returns {Backbone.Model}
                     */
                    update: function(attribute, value) {
                        containedReview[attribute] = value;
                        self.get('contained')[position] = containedReview;
                        self.trigger('change', Review.this);
                        return self;
                    },
                    /**
                     * @method contains().vocab
                     * @returns {Backbone.Model}
                     */
                    vocab: function() {
                        return skritter.user.data.items.findWhere({id: containedReview.itemId}).vocab();
                    }
                };
            return {};
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
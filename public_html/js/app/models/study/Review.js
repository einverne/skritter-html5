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
         * @method adjustPostion
         * @param {Number} position
         * @returns {Number}
         */
        adjustPostion: function(position) {
            if (this.max() === 1)
                return 0;
            return position === 0 ? position : position;
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
            if (this.max() === 1)
                return this.get('contained')[0];
            return this.get('contained')[position];
        },
        /**
         * @method item
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        item: function(position) {
            position = position ? position : 0;
            var containedReview = this.at(position);
            return skritter.user.data.items.findWhere({id: containedReview.itemId});
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
         * @method totalGrade
         * @returns {Number}
         */
        totalGrade: function() {
            var totalGrade = 0;
            for (var i = 0, length = this.get('contained').length; i < length; i++)
                totalGrade += this.get('contained')[i].score;
            return totalGrade;
        },
        /**
         * @method totalWrong
         * @returns {Number}
         */
        totalWrong: function() {
            var totalWrong = 0;
            for (var i = 0, length = this.get('contained').length; i < length; i++)
                if (this.get('contained')[i].score < 2)
                    totalWrong++;
            return totalWrong;
        },
        /**
         * @method update
         * @param {Number} position
         * @param {String} attribute
         * @param {String} value
         * @returns {Backbone.Model}
         */
        update: function(position, attribute, value) {
            var containedReview = this.at(position);
            containedReview[attribute] = value;
            this.get('contained')[this.adjustPostion(position)] = containedReview;
            this.trigger('change', this);
            return this;
        },
        /**
         * @method vocab
         * @param {Number} position
         * @returns {Backbone.Model}
         */
        vocab: function(position) {
            var containedItem = this.item(position);
            return containedItem.vocab();
        }
    });

    return Review;
});
/**
 * @module Skritter
 * @submodule Models
 * @param Review
 * @author Joshua McFarland
 */
define([
    'models/study/Review'
], function(Review) {
    /**
     * @class Item
     */
    var Item = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('items', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method containedItems
         * @returns {Array}
         */
        containedItems: function() {
            var items = [];
            var containedIds = this.vocab().containedItemIds(this.get('part'));
            for (var i = 0, length = containedIds.length; i < length; i++)
                items.push(skritter.user.data.items.get(containedIds[i]));
            return items;
        },
        /**
         * @method createReview
         * @returns {Backbone.Collection}
         */
        createReview: function() {
            var review = new Review();
        },
        /**
         * @method vocab
         * @returns {Backbone.Model}
         */
        vocab: function() {
            return skritter.user.data.vocabs.get(this.vocabId());
        },
        /**
         * @method vocabId
         * @returns {String}
         */
        vocabId: function() {
            var vocabIds = this.get('vocabIds');
            if (vocabIds.length === 0) {
                var splitId = this.id.split('-');
                return splitId[1] + '-' + splitId[2] + '-' + splitId[3];
            }
            return vocabIds[this.get('reviews') % vocabIds.length];
        }
    });

    return Item;
});
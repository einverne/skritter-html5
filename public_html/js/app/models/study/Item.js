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
            var id = this.id;
            var containedItems = this.containedItems();
            var now = skritter.fn.getUnixTime();
            var part = this.get('part');
            var vocab = this.vocab();
            var wordGroup = now + '_' + id;
            //base review
            review.set({
                character: (part === 'rune' || 'tone') && this.stroke() ? this.stroke().canvasCharacters() : null,
                id: now + '_0_' + id,
                itemId: id,
                bearTime: true,
                position: 0,
                wordGroup: wordGroup 
            });
            //contained reviews
            for (var i = 0, length = containedItems.length; i < length; i++) {
                var containedReview = new Review();
                var item = containedItems[i];
                containedReview.set({
                    bearTime: false,
                    character: (part === 'rune' || 'tone') && this.stroke() ? this.stroke().canvasCharacters() : null,
                    id: item.id,
                    itemId: item.id,
                    position: i + 1,
                    wordGroup: wordGroup
                });
                review.get('containedReviews').push(containedReview);
            }
            return review;
        },
        /**
         * @method stroke
         * @returns {Backbone.Model}
         */
        stroke: function() {
            return skritter.user.data.strokes.get(this.vocab().get('writing'));
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
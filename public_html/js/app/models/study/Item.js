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
            var group = now + '_' + id;
            //base review
            review.set({
                id: group,
                position: 1,
                part: this.get('part')
            });
            var containedReview = {
                itemId: id,
                score: 3,
                bearTime: true,
                submitTime: now,
                reviewTime: 0,
                thinkingTime: 0,
                currentInterval: this.get('interval'),
                actualInterval: this.has('last') ? now - this.get('last') : undefined,
                newInterval: null,
                wordGroup: group,
                previousInterval: this.get('previousInterval'),
                previousSuccess: this.get('previousSuccess')
            };
            review.get('contained').push(containedReview);
            //contained reviews
            for (var i = 0, length = containedItems.length; i < length; i++) {
                var containedItem = containedItems[i];
                containedReview = {
                    itemId: containedItem.id,
                    score: 3,
                    bearTime: false,
                    submitTime: now,
                    reviewTime: 0,
                    thinkingTime: 0,
                    currentInterval: containedItem.get('interval'),
                    actualInterval: containedItem.has('last') ? now - containedItem.get('last') : undefined,
                    newInterval: null,
                    wordGroup: group,
                    previousInterval: containedItem.get('previousInterval'),
                    previousSuccess: containedItem.get('previousSuccess')
                };
                review.get('contained').push(containedReview);
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
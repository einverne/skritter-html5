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
            var containedReviews = [];
            var now = skritter.fn.getUnixTime();
            var part = this.get('part');
            var group = now + '_' + id;
            //base review
            var baseReview = {
                itemId: id,
                score: 3,
                bearTime: true,
                submitTime: now,
                reviewTime: 0,
                thinkingTime: 0,
                currentInterval: this.has('interval') ? this.get('interval') : 0,
                actualInterval: this.has('last') ? now - this.get('last') : 0,
                newInterval: undefined,
                wordGroup: group,
                previousInterval: this.has('previousInterval') ? this.get('previousInterval') : 0,
                previousSuccess: this.has('previousSuccess') ? this.get('previousSuccess') : 0,
                originalItem: this.toJSON()
            };
            //contained reviews
            for (var i = 0, length = containedItems.length; i < length; i++) {
                var containedItem = containedItems[i];
                containedReviews.push({
                    itemId: containedItem.id,
                    score: 3,
                    bearTime: false,
                    submitTime: now,
                    reviewTime: 0,
                    thinkingTime: 0,
                    currentInterval: containedItem.has('interval') ? containedItem.get('interval') : 0,
                    actualInterval: containedItem.has('last') ? now - containedItem.get('last') : 0,
                    newInterval: undefined,
                    wordGroup: group,
                    previousInterval: containedItem.has('previousInterval') ? containedItem.get('previousInterval') : 0,
                    previousSuccess: containedItem.has('previousSuccess') ? containedItem.get('previousSuccess') : false,
                    originalItem: containedItem.toJSON()
                });
                    
            }
            //generate canvas characters for rune and tone prompts
            if (part === 'rune' || part === 'tone') {
                review.characters = [];
                if (containedItems.length === 0) {
                    review.characters.push(this.stroke().canvasCharacters());
                } else {
                    for (i = 0, length = containedItems.length; i < length; i++)
                        review.characters.push(containedItems[i].stroke().canvasCharacters());
                }
            }
            review.set({
                id: group,
                base: baseReview,
                contained: containedReviews,
                position: 1,
                part: this.get('part')
            }, {silent: true, sort: false});
            review.calculate();
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
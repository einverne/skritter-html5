/**
 * @module Skritter
 * @submodule Model
 * @param CanvasCharacter
 * @param Review
 * @param PromptData
 * @author Joshua McFarland
 */
define([
    'collections/CanvasCharacter',
    'models/study/Review',
    'collections/study/PromptData'
], function(CanvasCharacter, Review, PromptData) {
    /**
     * @class Item
     */
    var Item = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
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
         * Returns an array of items contained in multi-character items, but only for
         * rune and tone prompts.
         * 
         * @method getContainedItems
         * @returns {Array}
         */
        getContainedItems: function() {
            var containedItems = [];
            var part = this.get('part');
            var vocab = this.getVocab();
            if (vocab && _.contains(['rune', 'tone'], part))
                return vocab.getContainedItems(part);
            return containedItems;
        },
        /**
         * @method getRelatedItemIds
         * @returns {Array}
         */
        getRelatedItemIds: function() {
            var relatedItemIds = [];
            var part = this.get('part');
            var parts = ['defn', 'rdng', 'rune', 'tone'];
            for (var i in parts)
                if (parts[i] !== part)
                    relatedItemIds.push(this.id.replace(part, parts[i]));
            return relatedItemIds;
        },
        /**
         * Returns an object used to fuel the prompt view and stores data pertaining to it.
         * TODO: add more comments once this is ironed out
         * 
         * @method getPromptData
         * @returns {Object}
         */
        getPromptData: function() {
            var data = new PromptData();
            var character = null;
            var containedItems = this.getContainedItems();
            var id = this.get('id');
            var now = skritter.fn.getUnixTime();
            var part = this.get('part');
            var vocab = this.getVocab();
            var wordGroup = now + '_' + id;
            //generates data for defn, rdng and items without contained
            if (_.contains(['defn', 'rdng'], part) || containedItems.length === 0) {
                if (_.contains(['rune', 'tone'], part)) {
                    character = new CanvasCharacter();
                    character.targets = vocab.getCanvasCharacters(1, part);
                }
                data.add({
                    character: character,
                    finished: false,
                    id: this.get('id'),
                    item: this.clone(),
                    position: 1,
                    review: new Review({
                        id: now + '_0_' + this.get('id'),
                        itemId: id,
                        bearTime: true,
                        wordGroup: wordGroup
                    })
                });
            } else {
                //extract contained kana from japanese writing prompts
                var filteredContainedItems = [];
                for (var k = 0; k < containedItems.length; k++) {
                    if (!containedItems[k].isKana())
                        filteredContainedItems.push(containedItems[k]);
                }
                //generates data for rune and tone items with contained
                filteredContainedItems.unshift(this);
                for (var i = 0; i < filteredContainedItems.length; i++) {
                    var item = filteredContainedItems[i];
                    var itemId = item.get('id');
                    if (i !== 0) {
                        character = new CanvasCharacter();
                        character.targets = vocab.getCanvasCharacters(i, part);
                    }
                    data.add({
                        character: character,
                        finished: false,
                        id: itemId,
                        item: item.clone(),
                        position: i,
                        review: new Review({
                            id: now + '_' + i + '_' + itemId,
                            itemId: item.get('id'),
                            bearTime: (i === 0) ? true : false,
                            wordGroup: wordGroup
                        }),
                        vocab: item.getVocab()
                    });
                }
            }
            //appends the vocab to the end of the object
            data.id = id;
            data.item = this;
            data.vocab = vocab;
            return data;
        },
        /**
         * @method getVocab
         * @returns {Backbone.Model}
         */
        getVocab: function() {
            var vocabId = this.getVocabId();
            if (vocabId) {
                var vocab = skritter.data.vocabs.get(vocabId);
                if (vocab)
                    return vocab;
            }
            return null;
        },
        /**
         * @method getVocabId
         * @returns {String}
         */
        getVocabId: function() {
            var vocabIds = this.get('vocabIds');
            if (vocabIds.length > 0)
                return vocabIds[this.get('reviews') % vocabIds.length];
            return null;
        },
        /**
         * Returns true if the item is a single kana character. Since we don't currently support kana
         * and writing prompts it needs to be excluded.
         * 
         * @method isKana
         * @returns {Boolean}
         */
        isKana: function() {
            if (this.get('lang') === 'ja') {
                var writing = this.id.split('-')[2];
                if (writing.split('').length === 1 && skritter.fn.isKana(writing))
                    return true;
            }
            return false;
        }
    });

    return Item;
});
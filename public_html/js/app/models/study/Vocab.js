/**
 * @module Skritter
 * @submodule Models
 * @param SimpTradMap
 * @author Joshua McFarland
 */
define([
    'SimpTradMap'
], function(SimpTradMap) {
    /**
     * @class Vocab
     */
    var Vocab = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method characters
         * @returns {Array}
         */
        characters: function() {
            var characters = [];
            var containedVocabIds = this.has('containedVocabIds') ? this.get('containedVocabIds') : [];
            for (var i = 0, length = containedVocabIds.length; i < length; i++) {
                var vocabId = containedVocabIds[i];
                if (this.get('lang') === 'zh') {
                    characters.push(SimpTradMap.getWritingFromBase(vocabId));
                } else {
                    var character = vocabId.split('-')[1];
                    if (!skritter.fn.isKana(character))
                        characters.push(character);
                }
            }
            return characters;
        },
        /**
         * @method characterCount
         * @returns {Number}
         */
        characterCount: function() {
            return this.characters().length;
        },
        /**
         * @method containedItemIds
         * @param {String} part
         * @returns {Array}
         */
        containedItemIds: function(part) {
            var containedItemIds = [];
            var containedVocabIds = this.get('containedVocabIds');
            for (var i = 0, length = containedVocabIds.length; i < length; i++)
                containedItemIds.push(skritter.user.id + '-' + containedVocabIds[i] + '-' + part);
            return containedItemIds;
        }
    });

    return Vocab;
}); 
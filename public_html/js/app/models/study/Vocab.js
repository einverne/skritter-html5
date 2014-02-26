/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
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
            if (this.has('containedVocabIds')) {
                for (var i = 0, length = containedVocabIds.length; i < length; i++)
                    if (this.get('lang') === 'zh') {
                        characters.push(skritter.fn.simptrad.getWritingFromBase(containedVocabIds[i]));
                    } else {
                        characters.push(containedVocabIds[i].split('-')[1]);
                    }
            } else {
                var splitWriting = this.get('writing').split('');
                if (splitWriting.length === 1 && !skritter.fn.isKana(splitWriting[0]))
                    characters.push(splitWriting[0]);
                    
            }
            return characters;
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
        },
        /**
         * @method count
         * @returns {Number}
         */
        count: function() {
            return this.characters().length;
        }
    });

    return Vocab;
}); 
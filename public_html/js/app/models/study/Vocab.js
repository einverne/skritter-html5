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
                        characters.push(skritter.fn.simptrad.fromBase(containedVocabIds[i]));
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
            var containedVocabIds = this.has('containedVocabIds') ? this.get('containedVocabIds') : [];
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
        },
        /**
         * @method definition
         * @returns {String}
         */
        definition: function() {
            var definition;
            if (this.get('definitions')[skritter.user.settings.get('sourceLang')]) {
                definition = this.get('definitions')[skritter.user.settings.get('sourceLang')];
            } else if (this.get('definitions')['en']) {
                definition = this.get('definitions')['en'];
            }
            return definition;
        },
        /**
         * @method pinyin
         * @returns {String}
         */
        reading: function() {
            return skritter.fn.pinyin.toTone(this.get('reading'));
        },
        /**
         * @method sentence
         * @returns {Object}
         */
        sentence: function() {
            return this.has('sentenceId') ? skritter.user.data.sentences.findWhere({id: this.get('sentenceId')}) : undefined;
        },
        /**
         * @method writing
         * @param {Number} offset
         * @returns {String}
         */
        writing: function(offset) {
            var element = '';
            var position = 1;
            var actualCharacters = this.get('writing').split('');
            var containedCharacters = this.characters();
            for (var i = 0, length = actualCharacters.length; i < length; i++) {
                var character = actualCharacters[i];
                if (containedCharacters.indexOf(character) === -1) {
                    element += "<span>" + character + "</span>";
                } else {
                    if (offset && position <= offset) {
                        element += "<span id='writing-" + position + "' class='writing-hidden'>" +  character + "</span>";
                    } else {
                        element += "<span id='writing-" + position + "'>" +  character + "</span>";
                    }
                    position++;
                }
            }
            return element;
        }
    });

    return Vocab;
}); 
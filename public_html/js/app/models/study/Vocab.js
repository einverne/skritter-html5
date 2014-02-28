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
         * @param {Number} offset
         * @returns {Object}
         */
        pinyin: function(offset) {
            offset = offset ? offset - 1 : 0;
            var pinyin;
            var reading = 'fei1 ... bu4ke4';
            //reading = "you4'er2''";
            var reading = reading.match(/[a-z]+[0-9]+|\s\.\.\.\s|'/g);
            var output = reading;
            
            console.log(output);
            
            /*if (skritter.user.settings.isChinese()) {
                var reading = this.get('reading').replace(' ... ', '').replace("'", '');
                var syllable = reading.match(/[a-z]+/g);
                var tone = reading.match(/[0-9]+/g);
                reading = skritter.fn.pinyin.toTone(reading);
                if (reading.indexOf(',') === -1) {
                    var splitReading = [];
                    for (var i = 0, length = syllable.length; i < length; i++)
                        splitReading.push(skritter.fn.pinyin.toTone(syllable[i] + tone[i]));
                    pinyin = {reading: splitReading[offset], syllable: syllable[offset], tone: tone[offset]};
                } else {
                    pinyin = {reading: reading, syllable: syllable, tone: tone};
                }
            }*/
            return pinyin;
        },
        /**
         * @method reading
         * @param {Number} offset
         * @returns {String}
         */
        reading: function(offset) {            
            var element = '';
            var position = 1;
            var reading = this.get('reading');
            if (skritter.user.settings.isChinese()) {
                reading = reading.indexOf(', ') === -1 ? [reading] : reading.split(', ');
                for (var a = 0, lengthA = reading.length; a < lengthA; a++) {
                    var pieces = reading[a].match(/[a-z]+[0-9]+|\s\.\.\.\s|'/g);
                    element += "<span id=reading-" + (a + 1) + "'>";
                    for (var b = 0, lengthB = pieces.length; b < lengthB; b++) {
                        var piece = pieces[b];
                        if (piece.indexOf(' ... ') === -1 && piece.indexOf("'") === -1) {
                            if (offset && position >= offset) {
                                element += "<span class='position-" + position + " reading-hidden'>" + skritter.fn.pinyin.toTone(piece) + "</span>";
                            } else {
                                element += "<span class='position-" + position + "'>" + skritter.fn.pinyin.toTone(piece) + "</span>";
                            }
                            position++;
                        } else {
                            element += "<span class='reading-filler'>" + piece  + "</span>";
                        }
                    }
                    element += "</span>";
                }
            } else {
                reading = reading.split('');
                for (var i = 0, length = reading.length; i < length; i++)
                    element += "<span class='reading-kana'>" + reading[i] + "</span>";
            }
            console.log(element);
            return element;
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
                    element += "<span class='writing-filler'>" + character + "</span>";
                } else {
                    if (offset && position >= offset) {
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
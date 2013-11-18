/**
 * @module Skritter
 * @submodule Model
 * @param CanvasCharacter
 * @param CanvasStroke
 * @author Joshua McFarland
 * 
 * Properties
 * id
 * writing
 * reading
 * definitions
 * customDefinition
 * lang
 * audio
 * rareKanji
 * toughness
 * toughnessString
 * mnemonic
 * starred
 * style
 * changed
 * bannedParts
 * containedVocabIds
 * heisigDefinition
 * sentenceId
 * topMnemonic
 * 
 */
define([
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'backbone'
], function(CanvasCharacter, CanvasStroke) {

    var StudyVocab = Backbone.Model.extend({
        /**
         * @class StudyVocab
         */
        initialize: function() {
            this.on('change', this.cache);
        },
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            Skritter.storage.setItem('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getCanvasCharacters
         * @param {Number} index
         * @param {String} part
         * @return {Array}
         */
        getCanvasCharacters: function(index, part) {
            part = (part) ? part : 'rune';
            index = (index) ? index : 0;
            var characters = [];
            
            //loads the selected characters stroke data
            var rune = this.getCharacterAt(index);

            var variations = [];
            if (part === 'rune') {
                variations = Skritter.data.strokes.findWhere({rune: rune}).get('strokes');
            } else {
                var tones = this.getPinyinAt(index).tone.split(',');
                for (var t in tones)
                {
                    var tone = 'tone' + tones[t].replace(' ', '');
                    variations.push(Skritter.data.strokes.findWhere({rune: tone}).get('strokes'));
                }
            }

            //loops through the possible alternate variations
            for (var v in variations)
            {
                var character = new CanvasCharacter();
                var strokes = variations[v];
                var position = 1;
                for (var s in strokes)
                {
                    var stroke = new CanvasStroke();
                    var bitmapId = parseInt(strokes[s][0], 10);
                    var params = Skritter.data.params.findWhere({bitmapId: bitmapId});
                    stroke.set({
                       bitmapId: bitmapId,
                       data: strokes[s],
                       id: position + '|' + bitmapId,
                       part: part,
                       position: position,
                       rune: rune,
                       sprite: Skritter.assets.getStroke(bitmapId)
                    });

                    //adjusts the relative position for double strokes and sets contained strokes
                    if (params.has('contains')) {
                        stroke.set('contains', params.get('contains'));
                        position++;
                    }
                    position++;

                    character.add(stroke);
                }
                characters.push(character);
            }

            return characters;
        },
        /**
         * @method getCharacterAt
         * @param {Number} index
         * @return {String}
         */
        getCharacterAt: function(index) {
            return this.getCharacters()[index];
        },
        /**
         * @method getCharacterCount
         * @return {Number}
         */
        getCharacterCount: function() {
            return this.getCharacters().length;
        },
        /**
         * @method getCharacters
         * @return {Array}
         */
        getCharacters: function() {
            //ISSUE #27: skips kana characters in the vocabs writing string
            //ISSUE #30: skips japanese characters with leading kana
            return this.get('writing').split('').filter(function(a) {
                //removes characters that contain kana because they aren't currently supported
                return !Skritter.fn.isKana(a);
            });
        },
        /**
         * Returns an array of a sinlge character vocab items decompositions. It can optionally return
         * duplicates if that is so desired.
         * 
         * @method getDecomps
         * @param {Boolean} returnDuplicates
         * @returns {Array}
         */
        getDecomps: function(returnDuplicates) {
            if (this.getCharacterCount() > 1)
                return false;
            var writings = [];
            var decomp = Skritter.data.decomps.findWhere({writing: this.getCharacterAt(0)});
            if (!decomp.get('atomic')) {
                var children = decomp.get('Children');
                if (returnDuplicates)
                    return children;
                return children.filter(function(child) {
                    for (var i in writings)
                        if (writings[i] === child.writing)
                            return false;
                    writings.push(child.writing);
                    return true;
                });
            }
        },
        /**
         * @method getItems
         * @returns {Object}
         */
        getItems: function() {
            return Skritter.data.items.filterBy('id', this.get('id'), true);
        },
        /**
         * @method getPinyinAt
         * @param {Number} index
         * @return {Object}
         */
        getPinyinAt: function(index) {
            index = (index) ? index : 0;
            var reading = _.clone(this.get('reading').toLowerCase());
            var syllable = _.clone(reading);
            var tone = _.clone(reading);
            if (this.getCharacterCount() === 1) {
                syllable = syllable.replace(/[0-9]+/g, '');
                tone = tone.replace(/[a-z]+/g, '');
                return {syllable: syllable, tone: tone, reading: reading};
            }
            reading = reading.split(',');
            syllable = syllable.split(/\d+/g);
            tone = _.without(tone.split(/[a-z]+/g), '');
            return {syllable: syllable[index], tone: tone[index]};
        },
        /**
         * @method getReadingDisplayAt
         * @param {Number} index
         * @return {String}
         */
        getReadingDisplayAt: function(index) {
            var element = '';
            for (var i = 0; i < this.getCharacterCount(); i++)
            {
                if (index > i) {
                    if (this.getPinyinAt(i).reading) {
                       element += "<div class='prompt-display'>" + this.getPinyinAt(i).reading + "</div>";
                    } else {
                       element += "<div class='prompt-display'>" + this.getPinyinAt(i).syllable + this.getPinyinAt(i).tone + "</div>"; 
                    }
                } else {
                    element += "<div class='prompt-hidden'></div>";
                }
            }
            return element;
        },
        /**
         * @method getSentence
         * @return {String}
         */
        getSentence: function() {
            var sentence = Skritter.data.sentences.findWhere({id: this.get('sentenceId')});
            return (sentence) ? sentence : '';
        },
        /**
         * @method getWritingDisplayAt
         * @param {Number} index
         * @return {String}
         */
        getWritingDisplayAt: function(index) {
            var element = '';
            var characterIndex = 0;
            var characters = this.get('writing').split('');
            for (var i = 0; i < characters.length; i++)
            {
                var character = characters[i];
                if (Skritter.fn.isKana(character)) {
                    element += "<div class='prompt-display'>" + character + "</div>";
                } else {
                    if (index > characterIndex) {
                        element += "<div class='prompt-display'>" + character + "</div>";
                    } else {
                        element += "<div class='prompt-hidden'></div>";
                    }
                    characterIndex++;
                }
            }
            return element;
        },
        /**
         * @method hasCharacterAt
         * @param {Number} index
         * @return {Boolean}
         */
        hasCharacterAt: function(index) {
            if (index >= this.getCharacterCount())
                return false;
            return true;
        },
        /**
         * @method isSingleCharacter
         * @return {Boolean}
         */
        isSingleCharacter: function() {
            if (this.getCharacterCount() === 1)
                return true;
            return false;
        },
        /**
         * @method play
         * @return {undefined}
         */
        play: function() {
            if (this.has('audio'))
                Skritter.assets.getAudio(this.get('audio').replace('/sounds?file=', ''));
        }

    });


    return StudyVocab;
});
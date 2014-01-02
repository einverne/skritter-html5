/**
 * @module Skritter
 * @submodule Model
 * @param PinyinConverter
 * @param CanvasCharacter
 * @param CanvasStroke
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'collections/CanvasCharacter',
    'models/CanvasStroke',
    'backbone'
], function(PinyinConverter, CanvasCharacter, CanvasStroke) {
    /**
     * @class StudyVocab
     */
    var StudyVocab = Backbone.Model.extend({
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
         * @method getCanvasCharacters
         * @param {Number} index
         * @param {String} part
         * @return {Array}
         */
        getCanvasCharacters: function(index, part) {
            var characters = [];
            var variations = [];
            var tones = [];
            part = (part) ? part : 'rune';
            index = (index) ? index : 0;
            //loads the selected characters stroke data
            var rune = this.getCharacterAt(index);
            if (part === 'rune') {
                variations = skritter.data.strokes.findWhere({rune: rune}).get('strokes');
            } else {
                tones = this.getPinyinAt(index).tone.split(',');
                for (var t in tones)
                {
                    var tone = 'tone' + tones[t].replace(' ', '');
                    variations.push(skritter.data.strokes.findWhere({rune: tone}).get('strokes'));
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
                    var params = skritter.data.params.findWhere({bitmapId: bitmapId});
                    character.name = (part === 'rune') ? rune : 'tone' + tones[v].trim();
                    stroke.set({
                        bitmapId: bitmapId,
                        data: strokes[s],
                        id: position + '|' + bitmapId,
                        part: part,
                        position: position,
                        rune: rune,
                        sprite: skritter.assets.getStroke(bitmapId)
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
                return !skritter.fn.isKana(a);
            });
        },
        /**
         * Returns an array of a single character vocab items decompositions. It can optionally return
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
            var decomp = skritter.data.decomps.findWhere({writing: this.getCharacterAt(0)});
            if (decomp && decomp.has('atomic')) {
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
         * @method getDefinition
         * @returns {String}
         */
        getDefinition: function() {
            var definition = this.get('definitions')[skritter.user.getSetting('sourceLang')];
            if (typeof definition === 'undefined')
                return this.get('definitions').en;
            return definition;
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
            //TODO: figure out all variations of periods in reading prompts
            var tone = _.clone(reading).replace(' ... ', '');
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
         * @param {Boolean} hidden
         * @return {String}
         */
        getReadingDisplayAt: function(index, hidden) {
            var element = '';
            for (var i = 0; i < this.getCharacterCount(); i++) {
                if (hidden) {
                    if (index > i) {
                        //checks for characters with multiple tone answers
                        if (this.getPinyinAt(i).syllable.split(',').length > 1) {
                            element += "<div id='reading-" + i + "' class='prompt-tone-shown'>" + PinyinConverter.toTone(this.getPinyinAt(i).reading) + "</div>";
                        } else {
                            element += "<div id='reading-" + i + "' class='prompt-tone-shown'>" + PinyinConverter.toTone(this.getPinyinAt(i).syllable + this.getPinyinAt(i).tone) + "</div>";
                        }
                    } else if (index === i) {
                        element += "<div id='reading-" + i + "' class='prompt-tone-hidden'>" + this.getPinyinAt(i).syllable + "</div>";
                    } else {
                        element += "<div id='reading-" + i + "' class='prompt-tone-shown'>" + this.getPinyinAt(i).syllable + "</div>";
                    }
                } else {
                    if (index > i) {
                        if (this.getPinyinAt(i).syllable.split(',').length > 1) {
                            element += "<div id='reading-" + i + "' class='prompt-tone-shown'>" + PinyinConverter.toTone(this.getPinyinAt(i).reading) + "</div>";
                        } else {
                            element += "<div id='reading-" + i + "' class='prompt-tone-shown'>" + PinyinConverter.toTone(this.getPinyinAt(i).syllable + this.getPinyinAt(i).tone) + "</div>";
                        }
                    } else {
                        element += "<div id='reading-" + i + "' class='hidden-reading'>show</div>";
                        break;
                    }
                }
            }
            return element;
        },
        /**
         * @method getSentence
         * @return {String}
         */
        getSentence: function() {
            var sentence = skritter.data.sentences.findWhere({id: this.get('sentenceId')});
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
            for (var i = 0; i < characters.length; i++) {
                var character = characters[i];
                if (skritter.fn.isKana(character)) {
                    element += "<div id='writing-" + i + "' class='prompt-rune-shown'>" + character + "</div>";
                } else {
                    if (index > characterIndex) {
                        element += "<div id='writing-" + i + "' class='prompt-rune-shown'>" + character + "</div>";
                    } else {
                        element += "<div id='writing-" + i + "' class='prompt-rune-hidden'></div>";
                    }
                    characterIndex++;
                }
            }
            return element;
        },
        /**
         * @method play
         */
        play: function() {
            if (this.has('audio'))
                skritter.assets.getAudio(this.get('audio').replace('/sounds?file=', ''));
        },
        /**
         * @method validate
         * @param {Object} attributes
         */
        validate: function(attributes) {
            if (!this.has('changed') || attributes.changed <= this.get('changed')) {
                return 'Changed timestamp must be greater than current to update vocab.';
            }
        }
    });

    return StudyVocab;
});
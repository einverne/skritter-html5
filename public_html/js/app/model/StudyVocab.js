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
                variations = Skritter.study.strokes.findWhere({rune: rune}).get('strokes');
            } else {
                var tones = this.getPinyinAt(index).tone.split(',');
                for (var t in tones)
                {
                    var tone = 'tone' + tones[t].replace(' ', '');
                    variations.push(Skritter.study.strokes.findWhere({rune: tone}).get('strokes'));
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
                    var params = Skritter.study.params.findWhere({bitmapId: bitmapId});
                    stroke.set('bitmap', new createjs.Bitmap(Skritter.assets.getStroke(bitmapId).src));
                    stroke.set('bitmapId', bitmapId);
                    stroke.set('data', strokes[s]);
                    stroke.set('id', position + '|' + bitmapId);
                    stroke.set('part', part);
                    stroke.set('position', position);
                    stroke.set('rune', rune);

                    //adjusts the relative position for double strokes
                    if (params.has('contains'))
                        position++;
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
            return this.get('writing').split('')[index];
        },
        /**
         * @method getCharacterCount
         * @return {String}
         */
        getCharacterCount: function() {
            return this.get('writing').split('').length;
        },
        /**
         * @method getCharacters
         * @return {String}
         */
        getCharacters: function() {
            return this.get('writing').split('');
        },
        /**
         * @method getPinyinAt
         * @param {Number} index
         * @return {Object}
         */
        getPinyinAt: function(index) {
            index = (index) ? index : 0;
            var syllable = _.clone(this.get('reading'));
            var tone = _.clone(this.get('reading'));
            if (this.getCharacterCount() === 1) {
                syllable = syllable.replace(/[0-9]+/g, '');
                tone = tone.replace(/[a-z]+/g, '');
                return {syllable: syllable, tone: tone};
            }
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
                    element += "<div class='prompt-display'>" + this.getPinyinAt(i).syllable + "</div>";
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
            var sentence = Skritter.study.sentences.findWhere({id: this.get('sentenceId')});
            return (sentence) ? sentence : '';
        },
        /**
         * @method getWritingDisplayAt
         * @param {Number} index
         * @return {String}
         */
        getWritingDisplayAt: function(index) {
            var element = '';
            for (var i = 0; i < this.getCharacterCount(); i++)
            {
                if (index > i) {
                    element += "<div class='prompt-display'>" + this.getCharacterAt(i) + "</div>";
                } else {
                    element += "<div class='prompt-hidden'></div>";
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
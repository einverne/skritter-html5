/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'collections/CanvasCharacter',
    'models/CanvasStroke',
    'PinyinConverter'
], function(CanvasCharacter, CanvasStroke, PinyinConverter) {
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
         * @method getCanvasCharacters
         * @param {Number} index
         * @param {String} part
         * @return {Array}
         */
        getCanvasCharacters: function(index, part) {
            var characters = [];
            var variations = [];
            if (part === 'tone') {
                var tones = this.getReadingAt(position).tones;
                console.log(tones);
                for (var i in tones)
                    variations.push(skritter.data.strokes.findWhere({rune: 'tone' + tones[i]}).get('strokes'));
            } else {
                variations = skritter.data.strokes.findWhere({rune: this.getCharacters()[index - 1]}).get('strokes');
            }
            for (var v in variations) {
                var character = new CanvasCharacter();
                var strokes = variations[v];
                var position = 1;
                for (var s in strokes) {
                    var stroke = new CanvasStroke();
                    var bitmapId = parseInt(strokes[s][0], 10);
                    var params = skritter.data.params.findWhere({bitmapId: bitmapId});
                    stroke.set({
                        bitmapId: bitmapId,
                        data: strokes[s],
                        id: position + '|' + bitmapId,
                        part: part,
                        position: position,
                        sprite: skritter.assets.getStroke(bitmapId)
                    });
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
        getCharacterCount: function() {
            return this.getCharacters().length;
        },
        getCharacters: function() {
            return this.get('writing').split('').filter(function(character) {
                return !skritter.fn.isKana(character);
            });
        },
        getContainedItems: function(part) {
            var containedItems = [];
            var containedVocabIds = this.get('containedVocabIds');
            if (containedVocabIds) {
                for (var i in containedVocabIds) {
                    var containedItemId = skritter.user.get('user_id') + '-' + containedVocabIds[i] + '-' + part;
                    var containedItem = skritter.data.items.get(containedItemId);
                    if (containedItem)
                        containedItems.push(containedItem);
                }
            }
            return containedItems;
        },
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
        getDefinition: function() {
            //TODO: allow for definition images with proper css styling
            //.replace(/img:(http:\/\/\S+)/gi, '<img src="$1"/>')
            //.replace(/_([^ _][^_]*)_(?!\S{4})/gi, '<em>$1</em>')
            //.replace(/\n/gi, '<br/>')
            //.replace(/\*([^*]+)\*/gi, '<b>$1</b>');
            var definition = this.get('definitions')[skritter.user.getSetting('sourceLang')];
            if (typeof definition === undefined)
                definition = this.get('definitions').en;
            if (definition)
                return definition.replace(/img:(http:\/\/\S+)/gi, '');
            return null;
        },
        /**
         * @method getFontName
         * @returns {String}
         */
        getFontName: function() {
            if (this.get('lang') === 'zh')
                return 'simkai';
            return 'kaisho';
        },
        getReading: function() {
            return PinyinConverter.toTone(this.get('reading'));
        },
        /**
         * Gets a broken down reading object based on its position in the character if its
         * more than a single character item.
         * 
         * @method getReadingAt
         * @param {Number} position
         * @returns {Object}
         */
        getReadingAt: function(position) {
            var reading, syllable, tones;
            position = (position) ? position - 1 : 0;
            reading = this.get('reading').toLowerCase().replace(' ... ', '').replace("'", '');
            if (this.getCharacterCount() === 1) {
                syllable = reading.replace(/[0-9]+/g, '').replace(/\s/g, '').split(',');
                tones = reading.replace(/[a-z]+/g, '').replace(/\s/g, '').split(',').map(function(tone) {
                    return parseInt(tone, 10);
                });
                return {reading: reading, syllable: syllable, tones: tones};
            }
            syllable = _.without(reading.split(/[0-9]+/g), '')[position];
            tones = parseInt(_.without(reading.split(/[a-z]+/g), '')[position], 10);
            return {reading: syllable + tones, syllable: syllable, tones: tones};
        },
        /**
         * @method getReadingHTML
         * @param {Number} position
         * @param {Boolean} hidden
         * @returns {DOMElement}
         */
        getReadingDisplay: function(position, hidden) {
            position = (position) ? position - 1 : 0;
            var element = '';
            element += "<div class='prompt-reading-display'>";
            for (var i = 0; i < this.getCharacterCount(); i++) {
                if (hidden) {
                    if (position > i) {
                        if (this.getReadingAt(i).syllable.length > 1) {
                            element += "<div id='reading-" + i + "' class='prompt-reading-show'>" + PinyinConverter.toTone(this.getReadingAt(i).reading) + "</div>";
                        } else {
                            element += "<div id='reading-" + i + "' class='prompt-reading-show'>" + PinyinConverter.toTone(this.getReadingAt(i).syllable + this.getReadingAt(i).tone) + "</div>";
                        }
                    } else {
                        element += "<div id='reading-" + i + "' class='btn btn-default btn-xs hidden-reading'>show</div>";
                        break;
                    }
                    
                } else {
                    if (position > i) {
                        if (this.getReadingAt(i).syllable.length > 1) {
                            element += "<div id='reading-" + i + "' class='prompt-reading-show'>" + PinyinConverter.toTone(this.getReadingAt(i).reading) + "</div>";
                        } else {
                            element += "<div id='reading-" + i + "' class='prompt-reading-show'>" + PinyinConverter.toTone(this.getReadingAt(i).syllable + this.getReadingAt(i).tone) + "</div>";
                        }
                    } else if (position === i) {
                        element += "<div id='reading-" + i + "' class='prompt-reading-hide'>" + this.getReadingAt(i).syllable + "</div>";
                    } else {
                        element += "<div id='reading-" + i + "' class='prompt-reading-show'>" + this.getReadingAt(i).syllable + "</div>";
                    }
                }
            }
            element += "</div>";
            return element;
        },
        getSentence: function() {
            var sentence = skritter.data.sentences.findWhere({id: this.get('sentenceId')});
            return (sentence) ? sentence : null;
        },
        /**
         * @method getTextStyleClass
         * @returns {String}
         */
        getTextStyleClass: function() {
            if (this.get('lang') === 'zh')
                return 'chinese-text';
            return 'japanese-text';
        },
        /**
         * @method getWritingHTML
         * @param {Number} position
         * @returns {DOMElement}
         */
        getWritingDisplay: function(position) {
            position = (position) ? position - 1 : 0;
            var element = '';
            var characters = this.getCharacters();
            element += "<div class='prompt-writing-display'>";
            for (var i = 0; i < characters.length; i++) {
                if (skritter.fn.isKana(characters[i])) {
                    element += "<div id='writing-" + i + "' class='prompt-writing-show'>" + characters[i] + "</div>";
                } else {
                    if (position > i) {
                        element += "<div id='writing-" + i + "' class='prompt-writing-show'>" + characters[i] + "</div>";
                    } else {
                        element += "<div id='writing-" + i + "' class='prompt-writing-hide'></div>";
                    }
                }
            }
            element += "</div>";
            return element;
        },
        /**
         * Loads and returns the contained items as a callback based on the specified 
         * part and contained vocab ids.
         * 
         * @method loadContainedItems
         * @param {String} part
         * @param {Function} callback
         */
        loadContainedItems: function(part, callback) {
            var containedVocabIds = this.get('containedVocabIds');
            if (containedVocabIds) {
                var containedItemIds = [];
                for (var i in containedVocabIds)
                    containedItemIds.push(skritter.user.get('user_id') + '-' + containedVocabIds[i] + '-' + part);
                skritter.storage.getItems('items', containedItemIds, function(items) {
                    callback(skritter.data.items.add(items, {merge: true, silent: true}));
                });
            } else {
                callback([]);
            }
        },
        /**
         * @method play
         */
        play: function() {
            if (this.has('audio'))
                skritter.assets.getAudio(this.get('audio').replace('/sounds?file=', ''));
        },
        /**
         * @method spawnVirtualItems
         * @param {Array} parts
         * @returns {Backbone.Collection}
         */
        spawnVirtualItems: function(parts) {
            if (this.get('lang') === 'zh') {
                parts = (parts) ? parts : ['defn', 'rdng', 'rune', 'tone'];
            } else {
                parts = (parts) ? parts : ['defn', 'rdng', 'rune'];
            }
            var items = [];
            var vocabId = this.get('id');
            for (var i in parts)
                items.push(new StudyItem({
                    id: skritter.user.get('user_id') + '-' + vocabId + '-' + parts[i],
                    part: parts[i],
                    reviews: 0,
                    vocabIds: [vocabId]
                }));
            return items;
        }
    });

    return Vocab;
}); 
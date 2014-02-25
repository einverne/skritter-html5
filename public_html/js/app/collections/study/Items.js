/**
 * @module Skritter
 * @submodule Collections
 * @param Item
 * @param Vocabs
 * @author Joshua McFarland
 */
define([
    'models/study/Item',
    'collections/study/Vocabs'
], function(Item, Vocabs) {
    /**
     * @class Items
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Items.this = this;
            this.on('change', function(item) {
                item.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method load
         * @param {String} id
         * @param {Function} callback
         */
        load: function(id, callback) {
            var part = id.split('-')[4];
            async.waterfall([
                //intial item
                function(callback) {
                    skritter.storage.getItems('items', id, function(item) {
                        callback(null, Items.this.add(item[0], {merge: true, silent: true}));
                    });
                },
                //intial vocab
                function(item, callback) {
                    skritter.storage.getItems('vocabs', item.vocabId(), function(vocab) {
                        callback(null, item, skritter.user.data.vocabs.add(vocab[0], {merge: true, silent: true}));
                    });
                },
                //contained items
                function(item, vocab, callback) {
                    if (_.contains(['rune', 'tone'], part)) {
                        skritter.storage.getItems('items', vocab.containedItemIds(part), function(containedItems) {
                            callback(null, item, vocab, Items.this.add(containedItems, {merge: true, silent: true}));
                        });
                    } else {
                        callback(null, item, vocab, []);
                    }
                },
                //contained vocabs
                function(item, vocab, containedItems, callback) {
                    if (containedItems) {
                        var containedVocabIds = [];
                        for (var i = 0, length = containedItems.length; i < length; i++)
                            containedVocabIds.push(containedItems[i].vocabId());
                        skritter.storage.getItems('vocabs', containedVocabIds, function(containedVocabs) {
                            callback(null, item, vocab, containedItems, skritter.user.data.vocabs.add(containedVocabs, {merge: true, silent: true}));
                        });
                    } else {
                        callback(null, item, vocab, containedItems, []);
                    }
                },
                //sentence
                function(item, vocab, containedItems, containedVocabs, callback) {
                    if (vocab.has('sentenceId')) {
                        skritter.storage.getItems('sentences', vocab.get('sentenceId'), function(sentences) {
                            callback(null, item, vocab, containedItems, containedVocabs, skritter.user.data.sentences.add(sentences, {merge: true, silent: true}));
                        });
                    } else {
                        callback(null, item, vocab, containedItems, containedVocabs, null);
                    }
                },
                //strokes
                function(item, vocab, containedItems, containedVocabs, sentence, callback) {
                    if (part === 'rune') {
                        var writings = [];
                        if (containedVocabs.length === 0) {
                            writings.push(vocab.get('writing'));
                        } else {
                            for (var i = 0, length = containedVocabs.length; i < length; i++)
                                writings.push(containedVocabs[i].get('writing'));
                        }
                        skritter.storage.getItems('strokes', writings, function(strokes) {
                            callback(null, item, vocab, containedItems, containedVocabs, sentence, skritter.user.data.strokes.add(strokes, {merge: true, silent: true}));
                        });
                    } else {
                        callback(null, item, vocab, containedItems, containedVocabs, sentence, []);
                    }
                }
            ], function(error, item, vocab, containedItems, containedVocabs, sentence, strokes) {
                if (error) {

                } else {
                    log('LOADED ITEM', error, item, vocab, containedItems, containedVocabs, sentence, strokes);
                    callback();
                }
            });
        }
    });

    return Items;
});
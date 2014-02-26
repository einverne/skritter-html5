/**
 * @module Skritter
 * @submodule Models
 * @param Decomps
 * @param Items
 * @param Reviews
 * @param Sentences
 * @param Strokes
 * @param VocabLists
 * @param Vocabs
 * @author Joshua McFarland
 */
define([
    'collections/study/Decomps',
    'collections/study/Items',
    'collections/study/Reviews',
    'collections/study/Sentences',
    'collections/study/Strokes',
    'collections/study/VocabLists',
    'collections/study/Vocabs'
], function(Decomps, Items, Reviews, Sentences, Strokes, VocabLists, Vocabs) {
    /**
     * @class Data
     */
    var Data = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.decomps = new Decomps();
            this.items = new Items();
            this.reviews = new Reviews();
            this.sentences = new Sentences();
            this.strokes = new Strokes();
            this.vocablists = new VocabLists();
            this.vocabs = new Vocabs();
        },
        /**
         * Downloads all study data (including related resources) from the given offset. If the
         * offset isn't specified then it will perform a complete account download.
         * 
         * @method fetchStudyData
         * @param {Number} offset
         * @param {Boolean} includeSRSConfigs
         * @param {Function} callback1
         * @param {Function} callback2
         */
        fetchStudyData: function(offset, includeSRSConfigs, callback1, callback2) {
            offset = offset ? offset : 0;
            includeSRSConfigs = includeSRSConfigs ? includeSRSConfigs : false;
            var requests = [{
                    path: 'api/v' + skritter.api.get('version') + '/items',
                    method: 'GET',
                    params: {
                        sort: 'changed',
                        offset: offset,
                        include_vocabs: 'true',
                        include_strokes: 'true',
                        include_sentences: 'true',
                        include_heisigs: 'true',
                        include_top_mnemonics: 'true',
                        include_decomps: 'true'
                    },
                    spawner: true
                }];
            if (includeSRSConfigs)
                requests.push({
                    path: 'api/v' + skritter.api.get('version') + '/srsconfigs',
                    method: 'GET'
                });
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch) {
                        callback(null, batch);
                    });
                },
                function(batch, callback) {
                    function next() {
                        skritter.api.getBatch(batch.id, function(result) {
                            if (result) {
                                callback2(result);
                                async.series([
                                    async.apply(skritter.storage.setItems, 'decomps', result.Decomps),
                                    async.apply(skritter.storage.setItems, 'items', result.Items),
                                    async.apply(skritter.storage.setItems, 'srsconfigs', result.SRSConfigs),
                                    async.apply(skritter.storage.setItems, 'sentences', result.Sentences),
                                    async.apply(skritter.storage.setItems, 'strokes', result.Strokes),
                                    async.apply(skritter.storage.setItems, 'vocabs', result.Vocabs)
                                ], function() {
                                    next();
                                });
                            } else {
                                callback();
                            }
                        });
                    }
                    next();
                }
            ], function() {
                if (typeof callback1 === 'function')
                    callback1();
            });
        },
        /**
         * Downloads vocablists using the spawner that are directly stored in the database.
         * 
         * @method fetchVocabLists
         * @param {Function} callback
         */
        fetchVocabLists: function(callback) {
            var requests = [
                {
                    path: 'api/v' + skritter.api.get('version') + '/vocablists',
                    method: 'GET',
                    params: {
                        sort: 'custom'
                    },
                    spawner: true
                },
                {
                    path: 'api/v' + skritter.api.get('version') + '/vocablists',
                    method: 'GET',
                    params: {
                        sort: 'official'
                    },
                    spawner: true
                },
                {
                    path: 'api/v' + skritter.api.get('version') + '/vocablists',
                    method: 'GET',
                    params: {
                        sort: 'studying'
                    },
                    spawner: true
                }
            ];
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch) {
                        callback(null, batch);
                    });
                },
                function(batch, callback) {
                    function next() {
                        skritter.api.getBatch(batch.id, function(result) {
                            if (result) {
                                skritter.storage.setItems('vocablists', result.VocabLists, next);
                            } else {
                                callback();
                            }
                        });
                    }
                    next();
                }
            ], function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * Loads an item and all of the resources required for a prompt. If something is missing an error is returned,
         * the itme is flagged and an error message is appended to it.
         * 
         * @method loadItem
         * @param {String} itemId
         * @param {Function} callback
         */
        loadItem: function(itemId, callback) {
            var part = itemId.split('-')[4];
            async.waterfall([
                //intial item
                function(callback) {
                    skritter.storage.getItems('items', itemId, function(item) {
                        if (item.length > 0) {
                            callback(null, Items.this.add(item[0], {merge: true, silent: true}));
                        } else {
                            callback("Initial item is missing.");
                        }
                    });
                },
                //intial vocab
                function(item, callback) {
                    skritter.storage.getItems('vocabs', item.vocabId(), function(vocab) {
                        if (vocab.length > 0) {
                            callback(null, item, skritter.user.data.vocabs.add(vocab[0], {merge: true, silent: true}));
                        } else {
                            callback("Initial vocab is missing.", item);
                        }
                    });
                },
                //contained items
                function(item, vocab, callback) {
                    if (_.contains(['rune', 'tone'], part)) {
                        var containedItemIds = vocab.containedItemIds(part);
                        var containedItemCount = containedItemIds.length;
                        skritter.storage.getItems('items', containedItemIds, function(containedItems) {
                            if (containedItemCount === containedItems.length) {
                                callback(null, item, vocab, Items.this.add(containedItems, {merge: true, silent: true}));
                            } else {
                                callback("One or more of the contained items is missing.", item);
                            }
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
                        var containedVocabCount = containedVocabIds.length;
                        skritter.storage.getItems('vocabs', containedVocabIds, function(containedVocabs) {
                            if (containedVocabCount === containedVocabs.length) {
                                callback(null, item, vocab, containedItems, skritter.user.data.vocabs.add(containedVocabs, {merge: true, silent: true}));
                            } else {
                                callback("One or more of the contained vocabs is missing.", item);
                            }
                        });
                    } else {
                        callback(null, item, vocab, containedItems, []);
                    }
                },
                //sentence
                function(item, vocab, containedItems, containedVocabs, callback) {
                    if (vocab.has('sentenceId')) {
                        skritter.storage.getItems('sentences', vocab.get('sentenceId'), function(sentences) {
                            if (sentences.lengh === 1) {
                                callback(null, item, vocab, containedItems, containedVocabs, skritter.user.data.sentences.add(sentences, {merge: true, silent: true}));
                            } else {
                                callback("Sentence is missing.", item);
                            }
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
                        var writingsCount = writings.length;
                        skritter.storage.getItems('strokes', writings, function(strokes) {
                            if (writingsCount === strokes.length) {
                                callback(null, item, vocab, containedItems, containedVocabs, sentence, skritter.user.data.strokes.add(strokes, {merge: true, silent: true}));
                            } else {
                                callback("One or more of the strokes are missing.", item);
                            }
                        });
                    } else {
                        callback(null, item, vocab, containedItems, containedVocabs, sentence, []);
                    }
                }
            ], function(error, item, vocab, containedItems, containedVocabs, sentence, strokes) {
                if (error) {
                    log('ITEM ERROR', item, error);
                    if (item)
                        item.set({
                            flag: 'true',
                            flagMessage: error
                        });
                    callback();
                } else {
                    log('ITEM LOADED', error, item, vocab, containedItems, containedVocabs, sentence, strokes);
                    if (item.has('flag')) {
                        item.unset('flag');
                        item.unset('flagMessage');
                    }
                    callback(item);
                }
            });
        }
    });

    return Data;
});
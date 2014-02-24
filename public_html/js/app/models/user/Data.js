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
         * @param {Number} offset
         * @param {Function} callback
         */
        fetchVocabLists: function(offset, callback) {
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
        }
    });

    return Data;
});
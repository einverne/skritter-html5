/**
 * @module Skritter
 * @class Sync
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method methodFlash
     * @param {Function} callback
     */
    var methodFlash = function(callback) {
        //TODO: implement a system for flash style loading and syncing
        callback();
    };
    /**
     * @method methodFull
     * @param {Function} callback
     */
    var methodFull = function(callback) {
        var requests = [
            {
                path: 'api/v' + skritter.api.version + '/items',
                method: 'GET',
                params: {
                    sort: 'changed',
                    offset: skritter.user.getLastSync(),
                    include_vocabs: 'true',
                    include_strokes: 'true',
                    include_sentences: 'true',
                    include_heisigs: 'true',
                    include_top_mnemonics: 'true',
                    include_decomps: 'true'
                },
                spawner: true
            },
            {
                path: 'api/v' + skritter.api.version + '/srsconfigs',
                method: 'GET',
                params: {
                    bearer_token: this.token
                }
            }
        ];
        skritter.async.waterfall([
            //make the initial batch request for changed items
            function(callback) {
                skritter.modal.setProgress(100, 'Requesting Batch');
                skritter.api.requestBatch(requests, function(batch) {
                    callback(null, batch);
                });
                
            },
            //download requested batch and then store it locally
            function(batch, callback) {
                var size = 0;
                nextBatch();
                function nextBatch() {
                    skritter.api.getBatch(batch.id, function(result) {
                        if (result) {
                            size += result.responseSize;
                            skritter.async.parallel([
                                function(callback) {
                                    skritter.data.decomps.insert(result.Decomps, callback);
                                },
                                function(callback) {
                                    skritter.data.items.insert(result.Items, callback);
                                },
                                function(callback) {
                                    skritter.data.srsconfigs.insert(result.SRSConfigs, callback);
                                },
                                function(callback) {
                                    skritter.data.sentences.insert(result.Sentences, callback);
                                },
                                function(callback) {
                                    skritter.data.strokes.insert(result.Strokes, callback);
                                },
                                function(callback) {
                                    skritter.data.vocabs.insert(result.Vocabs, callback);
                                }
                            ], function() {
                                if (size > 1024)
                                    skritter.modal.setProgress(100, skritter.fn.bytesToSize(size));
                                nextBatch();
                            });
                        } else {
                            callback();
                        }
                    });
                }
            },
            //post reviews to the server and remove them locally
            function(callback) {
                if (skritter.data.reviews.length > 0 && skritter.user.getLastSync()) {
                    skritter.modal.setProgress(100, 'Posting Reviews');
                    skritter.data.reviews.sync(function() {
                        callback();
                    });
                } else {
                    callback();
                }
            }
        ], function() {
            skritter.user.setLastSync();
            callback();
        });
    };
    /**
     * @method methodPartial
     * @param {Function} callback
     */
    var methodPartial = function(callback) {
        skritter.async.waterfall([
            //fetch the condensed items and store them into the database
            function(callback) {
                skritter.api.getItemsCondensed(function(items) {
                    skritter.data.items.add(items, {merge: true, silent: true});
                    skritter.data.items.cache(callback);

                });
            },
            //fetch full records for a limited number of next items
            function(callback) {
                skritter.api.getItemsById(skritter.data.items.getNextIds(), function(data) {
                    callback(null, data);
                });
            },
            //store the data in in collections and the database
            function(data, callback) {
                skritter.data.decomps.add(data.Decomps, {merge: true});
                skritter.data.items.add(data.Items, {merge: true});
                skritter.data.srsconfigs.add(data.SRSConfigs, {merge: true});
                skritter.data.sentences.add(data.Sentences, {merge: true});
                skritter.data.strokes.add(data.Strokes, {merge: true});
                skritter.data.vocabs.add(data.Vocabs, {merge: true});
                callback();
            },
            //cache all of the data and callback finished
            function(callback) {
                skritter.async.parallel([
                    function(callback) {
                        skritter.data.decomps.cache(callback);
                    },
                    function(callback) {
                        skritter.data.items.cache(callback);
                    },
                    function(callback) {
                        skritter.data.srsconfigs.cache(callback);
                    },
                    function(callback) {
                        skritter.data.sentences.cache(callback);
                    },
                    function(callback) {
                        skritter.data.strokes.cache(callback);
                    },
                    function(callback) {
                        skritter.data.vocabs.cache(callback);
                    }
                ], callback);
            }
        ], function() {
            skritter.user.setLastSync();
            callback();
        });
    };

    return {
        methodFlash: methodFlash,
        methodFull: methodFull,
        methodpartial: methodPartial
    };
});
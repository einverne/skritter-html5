/**
 * @module Skritter
 * @class Sync
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method flash
     * @param {Function} callback
     */
    var flash = function(callback) {
        //TODO: implement a system for flash style loading and syncing
    };
    /**
     * @method full
     * @param {Function} callback
     */
    var full = function(callback) {
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
                skritter.api.getBatchCombined(batch.id, function(size) {
                    if (size > 1024)
                        skritter.modal.setProgress(100, skritter.fn.bytesToSize(size));
                }, function(result) {
                    skritter.data.decomps.add(result.Decomps, {merge: true});
                    skritter.data.items.add(result.Items, {merge: true});
                    skritter.data.srsconfigs.add(result.SRSConfigs, {merge: true});
                    skritter.data.sentences.add(result.Sentences, {merge: true});
                    skritter.data.strokes.add(result.Strokes, {merge: true});
                    skritter.data.vocabs.add(result.Vocabs, {merge: true});
                    callback();
                });
            },
            //cache all of the newly downloaded data into the database
            function(callback) {
                skritter.modal.setProgress(100, 'Storing Data');
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
                ], function() {
                    callback();
                });
            },
            //post reviews to the server and remove them locally
            function(callback) {
                if (skritter.data.reviews.length > 0 && !skritter.user.getLastSync()) {
                    skritter.modal.setTitle('Posting Reviews').setProgress(100, '');
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
     * @method partial
     * @param {Function} callback
     */
    var partial = function(callback) {
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
        flash: flash,
        full: full,
        partial: partial
    };
});
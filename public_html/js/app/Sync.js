/**
 * @module Skritter
 * @class Sync
 * @author Joshua McFarland
 */
define(function() {
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
                    if (batch.status === 404) {
                        callback(batch, null);
                    } else {
                        callback(null, batch);
                    }
                });
            },
            //download requested batch and then store it locally
            function(batch, callback) {
                var size = 0;
                nextBatch();
                function nextBatch() {
                    skritter.api.getBatch(batch.id, function(result) {
                        if (result && _.contains([404, 408], result.status)) {
                            window.setTimeout(function() {
                                nextBatch();
                            }, 5000);
                        } else if (result) {
                            size += result.responseSize;
                            skritter.async.series([
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
                                window.setTimeout(function() {
                                    nextBatch();
                                }, 1000);
                            });
                        } else {
                            callback();
                        }
                    });
                }
            },
            //check for previous review errors before posting new reviews
            function(callback) {
                skritter.user.checkReviewErrors(function(errors) {
                    var now = skritter.moment().format('YYYY-MM-DD hh:mm:ss');
                    for (var i in errors)
                        skritter.log.reviewError(now, errors[i]);
                    callback();
                }, skritter.user.getLastSync());
            },
            //post reviews to the server and remove them locally
            function(callback) {
                if (skritter.data.reviews.length > 0 && skritter.user.getLastSync()) {
                    skritter.modal.setProgress(100, 'Posting Reviews');
                    skritter.data.reviews.sync(function(quantity) {
                        skritter.log.review(quantity);
                        callback();
                    });
                } else {
                    callback();
                }
            }
        ], function(error) {
            if (error) {
                callback(error);
            } else {
                skritter.user.setLastSync();
                callback();
            }
        });
    };

    return {
        methodFull: methodFull
    };
});
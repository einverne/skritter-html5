/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class Sync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @property {Object} defaults
         */
        defaults: {
            syncing: false
        },
        /**
         * @method full
         * @param {Function} callback
         */
        full: function(callback) {
            //stop new sync from starting if currently syncing
            if (this.get('syncing')) {
                callback();
                return;
            } else {
                this.set('syncing', true);
            }
            var self = this;
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
            var started, completed;
            var received = 0;
            var sent = 0;
            started = skritter.moment().format('YYYY-MM-DD hh:mm:ss');
            skritter.async.waterfall([
                //make the initial batch request for changed items
                function(callback) {
                    console.log('syncing from', skritter.moment(skritter.user.getLastSync() * 1000).format('YYYY[-]MM[-]DD h:mm:ss a'));
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
                                if (result.Items)
                                    received += result.Items.length;
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
                //post reviews to the server and remove them locally
                function(callback) {
                    if (skritter.data.reviews.length > 0 && skritter.user.getLastSync()) {
                        skritter.modal.setProgress(100, 'Posting Reviews');
                        skritter.data.reviews.sync(function(quantity) {
                            sent = quantity;
                            callback();
                        });
                    } else {
                        callback();
                    }
                }
            ], function(error) {
                self.set('syncing', false);
                if (error) {
                    callback(error);
                } else {
                    completed = skritter.moment().format('YYYY-MM-DD hh:mm:ss');
                    skritter.log.sync(started, completed, received, sent);
                    skritter.user.setLastSync();
                    callback();
                }
            });
        }
    });

    return Sync;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Sync
     */
    var Sync = Backbone.Model.extend({
        /**    var Sync = Backbone.Model.extend({

         * @method initialize
         */
        initialize: function() {
            Sync.this = this;
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            active: false,
            addOffset: 0
        },
        /**
         * @method addItems
         * @param {Number} offset
         * @param {Number} limit
         * @param {Function} callback
         */
        addItems: function(offset, limit, callback) {
            var batchId = null;
            var addedItemCount = 0;
            var requests = [
                {
                    path: 'api/v' + skritter.api.get('version') + '/items/add',
                    method: 'POST',
                    cache: false,
                    params: {
                        limit: limit,
                        offset: this.get('addOffset')
                    }
                }
            ];
            async.series([
                //request the new items using a batch request
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch) {
                        batchId = batch.id;
                        callback();
                    });
                },
                //start fetching the new items as they are completed
                function(callback) {
                    skritter.modal.setProgress(100, 'Getting Items');
                    getNext();
                    function getNext() {
                        skritter.api.getBatch(batchId, function(result) {
                            if (result) {
                                if (result.Items)
                                    skritter.log.console('ADDED ITEMS', result.Items);
                                addedItemCount += result.Items.length;
                                window.setTimeout(function() {
                                    getNext();
                                }, 2000);
                            } else {
                                callback();
                            }
                        });
                    }
                },
                //run a fresh sync to get the new items and update
                function(callback) {
                    Sync.this.set('addOffset', Sync.this.get('addOffset') + 1);
                    if (Sync.this.isSyncing()) {
                        Sync.this.listenToOnce(Sync.this, 'complete', startSync);
                    } else {
                        startSync();
                    }
                    function startSync() {
                        Sync.this.full(offset, callback);
                    }
                },
                //reload the scheduler data
                function(callback) {
                    skritter.scheduler.loadAll(callback);
                }
            ], function(error) {
                if (error) {
                    if (typeof callback === 'function')
                        callback(error);
                } else {
                    if (typeof callback === 'function')
                        callback(addedItemCount);
                }
            });
        },
        /**
         * @method full
         * @param {Number} offset
         * @param {Function} callback
         */
        full: function(offset, callback) {
            offset = (offset) ? offset : 0;
            var batchId = null;
            this.set('active', true);
            var requests = [
                {
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
                },
                {
                    path: 'api/v' + skritter.api.get('version') + '/srsconfigs',
                    method: 'GET'
                }
            ];
            async.series([
                function(callback) {
                    skritter.log.console('SYNCING FROM', (offset === 0) ? 'THE BEGINNING OF TIME' : moment(offset * 1000).format('MMMM Do YYYY, h:mm:ss A'));
                    skritter.api.requestBatch(requests, function(batch) {
                        batchId = batch.id;
                        callback();
                    });
                },
                function(callback) {
                    var totalSize = 0;
                    getNext();
                    function getNext() {
                        skritter.api.getBatch(batchId, function(result) {
                            if (result) {
                                skritter.log.console('SYNC RESULT', result);
                                async.series([
                                    async.apply(skritter.data.decomps.insert, result.Decomps),
                                    async.apply(skritter.data.items.insert, result.Items),
                                    async.apply(skritter.data.srsconfigs.insert, result.SRSConfigs),
                                    async.apply(skritter.data.sentences.insert, result.Sentences),
                                    async.apply(skritter.data.strokes.insert, result.Strokes),
                                    async.apply(skritter.data.vocabs.insert, result.Vocabs)
                                ], function() {
                                    totalSize += result.responseSize;
                                    if (totalSize > 1024)
                                        skritter.modal.setProgress(null, skritter.fn.bytesToSize(totalSize));
                                    window.setTimeout(function() {
                                        getNext();
                                    }, 2000);
                                });
                            } else {
                                callback();
                            }
                        });
                    }
                },
                function(callback) {
                    if (offset === 0) {
                        skritter.data.vocablists.fetchAll(callback);
                    } else {
                        callback();
                    }
                },
                function(callback) {
                    if (offset !== 0) {
                        skritter.data.reviews.post(callback);
                    } else {
                        callback();
                    }
                }
            ], function() {
                Sync.this.set('active', false);
                Sync.this.triggerComplete();
                callback();
            });
        },
        /**
         * @method isSyncing
         */
        isSyncing: function() {
            if (this.get('active'))
                return true;
            return false;
        },
        /**
         * @method triggerComplete
         */
        triggerComplete: function() {
            this.trigger('complete');
        }
    });

    return Sync;
});
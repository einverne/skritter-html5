/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Sync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @property {Object} defaults
         */
        defaults: {
            active: false
        },
        /**
         * @method full
         * @param {Number} offset
         * @param {Function} callback
         */
        full: function(offset, callback) {
            var self = this;
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
                    callback();
                }
            ], function() {
                self.set('active', false);
                self.triggerComplete();
                callback();
            });
        },
        /**
         * @method isSyncing
         */
        syncing: function() {
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
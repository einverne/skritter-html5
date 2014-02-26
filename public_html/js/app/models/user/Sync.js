/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method UserSync
     */
    var Sync = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Sync.this = this;
            Sync.syncing = false;
            //stores user sync to localStorage when they are changed
            this.on('change', this.cache);
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            last: 0
        },
        /**
         * @method cache
         * @param {Object} event
         */
        cache: function(event) {
            localStorage.setItem(skritter.user.id + '-sync', JSON.stringify(event.toJSON()));
        },
        /**
         * Checks whether the user has synced before. This will generally be used to determine when to
         * start the initial download as opposed to background syncing.
         * 
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            if (this.get('last'))
                return false;
            return true;
        },
        /**
         * @method isSyncing
         * @returns {Boolean}
         */
        isSyncing: function() {
            return Sync.syncing;
        },
        /**
         * @method start
         * @param {Function} callback
         * @param {Boolean} showModal
         */
        start: function(callback, showModal) {
            var offset = this.get('last');
            var downloadedRequests = 0;
            var responseSize = 0;
            Sync.syncing = true;
            log('SYNCING FROM', (offset === 0) ? 'THE BEGINNING OF TIME' : moment(offset * 1000).format('YYYY-MM-DD H:mm:ss'));
            if (showModal)
                skritter.modals.show('download')
                        .set('.modal-title', 'SYNC')
                        .set('.modal-title-right', 'Downloading')
                        .progress(100)
                        .set('.modal-footer', false);
            async.series([
                //downloads all of the changed data since the last sync
                function(callback) {
                    skritter.user.data.fetchStudyData(offset, true, callback, function(result) {
                        downloadedRequests += result.downloadedRequests;
                        responseSize += result.responseSize;
                        if (responseSize > 0)
                            skritter.modals.set('.modal-title-right', 'Downloading (' + skritter.fn.bytesToSize(responseSize) + ')');
                        if (result.totalRequests > 10 && result.runningRequests === 0)
                            skritter.modals.progress((downloadedRequests / result.totalRequests) * 100);
                    });
                },
                //downloads vocablists if this is the users first sync
                function(callback) {
                    if (offset === 0) {
                        skritter.modals
                                .progress(100)
                                .set('.modal-title-right', 'Downloading Lists');
                        skritter.user.data.fetchVocabLists(callback);
                    } else {
                        callback();
                    }
                },
                //posts reviews to the server if there are any
                function(callback) {
                    callback();
                }
            ], function() {
                log('FINISHED SYNCING AT', moment(skritter.fn.getUnixTime() * 1000).format('YYYY-MM-DD H:mm:ss'));
                Sync.this.set('last', skritter.fn.getUnixTime());
                if (typeof callback === 'function')
                    callback();
                skritter.modals.hide();
                Sync.syncing = false;
            });
        }
    });
    
    return Sync;
});
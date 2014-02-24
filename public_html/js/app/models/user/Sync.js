/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @method Sync
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
            var responseSize = 0;
            Sync.syncing = true;
            log('SYNCING FROM', (offset === 0) ? 'THE BEGINNING OF TIME' : moment(offset * 1000).format('MMMM Do YYYY, h:mm:ss A'));
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
                        responseSize += result.responseSize;
                        if (responseSize > 0)
                            skritter.modals
                                    .progress(100 - ((result.runningRequests / result.totalRequests) * 100))
                                    .set('.modal-title-right', 'Downloading (' + skritter.fn.bytesToSize(responseSize) + ')');
                    });
                },
                //downloads vocablists if this is the users first sync
                function(callback) {
                    if (offset === 0) {
                        skritter.modals
                                .progress(100)
                                .set('.modal-title-right', 'Downloading Lists');
                        skritter.user.data.fetchVocabLists(0, callback);
                    } else {
                        callback();
                    }
                },
                //posts reviews to the server if there are any
                function(callback) {
                    callback();
                }
            ], function() {
                log('FINISHED SYNCING', moment(skritter.fn.getUnixTime() * 1000).format('MMMM Do YYYY, h:mm:ss A'));
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
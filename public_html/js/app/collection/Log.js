/**
 * @module Skritter
 * @submodule Collection
 * @param Log
 * @author Joshua McFarland
 */
define([
    'model/LogItem',
    'backbone'
], function(LogItem) {
    /**
     * @class Log
     */
    var Log = Backbone.Collection.extend({
        /**
         * @property {Log} model
         */
        model: LogItem,
        /**
         * @method cache
         * @param {Callback} callback
         */
        cache: function(callback) {
            if (this.length === 0) {
                callback();
                return;
            }
            Skritter.storage.setItems('log', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         * @returns {undefined}
         */
        loadAll: function(callback) {
            Skritter.storage.getItems('log', function(log) {
                Skritter.log.add(log);
                callback(null, log);
            });
        }
    });
    
    
    return Log;
});



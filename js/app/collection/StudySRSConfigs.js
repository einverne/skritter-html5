/**
 * @module Skritter
 * @submodule Collection
 * @param {Model} StudySRSConfig
 * @author Joshua McFarland
 */
define([
    'model/StudySRSConfig',
    'backbone'
], function(StudySRSConfig) {
    /**
     * @class StudySRSConfigs
     */
    var StudySRSConfigs = Backbone.Collection.extend({
        /**
         * @property {StudySRSConfig} model
         */
        model: StudySRSConfig,
        /**
         * @method cache
         * @param {Function} callback
         * @returns {undefined}
         */
        cache: function(callback) {
            if (this.length === 0) {
                callback();
                return;
            }
            Skritter.storage.setItems('srsconfigs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method fetch
         * @param {Function} callback
         * @returns {undefined}
         */
        fetch: function(callback) {
            Skritter.api.getSRSConfigs(Skritter.user.getSetting('targetLang'), function(result) {
                Skritter.data.srsconfigs.add(result);
                callback(null, result);
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         * @returns {undefined}
         */
        loadAll: function(callback) {
            Skritter.storage.getItems('srsconfigs', function(srsconfigs) {
                Skritter.data.srsconfigs.add(srsconfigs);
                callback(null, srsconfigs);
            });
        }

    });


    return StudySRSConfigs;
});
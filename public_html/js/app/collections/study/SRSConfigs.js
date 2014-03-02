/**
 * @module Skritter
 * @submodule Collections
 * @param SRSConfig
 * @author Joshua McFarland
 */
define([
    'models/study/SRSConfig'
], function(SRSConfig) {
    /**
     * @class SRSConfigs
     */
    var SRSConfigs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(srsconfig) {
                srsconfig.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: SRSConfig,
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('srsconfigs', function(reviews) {
                self.add(reviews, {merge: true, silent: true});
                callback();
            });
        }
    });

    return SRSConfigs;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param {Model} SRSConfig
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
         * @method insert
         * @param {Array} srsconfigs
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(srsconfigs, callback) {
            if (srsconfigs) {
                skritter.data.srsconfigs.add(srsconfigs, {merge: true, silent: true});
                skritter.storage.setItems('srsconfigs', srsconfigs, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('srsconfigs', function(srsconfigs) {
                skritter.data.srsconfigs.add(srsconfigs, {merge:true, silent: true});
                callback();
            });
        }
    });

    return SRSConfigs;
});
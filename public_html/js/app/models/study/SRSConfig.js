/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class SRSConfigs
     */
    var SRSConfigs = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('srsconfigs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });

    return SRSConfigs;
});
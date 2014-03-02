/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class SRSConfigs
     */
    var SRSConfigs = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'part',
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
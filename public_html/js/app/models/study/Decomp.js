/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'PinyinConverter'
], function(PinyinConverter) {
    /**
     * @class Decomp
     */
    var Decomp = Backbone.Model.extend({
	/**
         * @property {String} idAttribute
         */
        idAttribute: 'writing',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('decomps', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getReading
         * @returns {String}
         */
        getReading: function() {
            return PinyinConverter.toTone(this.get('reading'));
        }
    });
    
    return Decomp;
});
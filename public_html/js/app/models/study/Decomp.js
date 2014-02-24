/**
 * @module Skritter
 * @submodule Models
 * @param PinyinConverter
 * @author Joshua McFarland
 */
define(function() {
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
        }
    });
    
    return Decomp;
});
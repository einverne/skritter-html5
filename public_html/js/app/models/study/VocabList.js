/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('vocablists', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });
    
    return VocabList;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabList.this = this;
        },
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
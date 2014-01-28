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
         * @method load
         * @param {Function} callback
         */
        load: function(callback) {
            skritter.api.getVocabList(this.id, function(list) {
                var list = VocabList.this.set(list);
                if (typeof callback === 'function')
                    callback(list);
            });
        }
    });
    
    return VocabList;
});
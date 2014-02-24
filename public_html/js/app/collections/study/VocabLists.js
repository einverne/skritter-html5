/**
 * @module Skritter
 * @submodule Collections
 * @param VocabList
 * @author Joshua McFarland
 */
define([
    'models/study/VocabList'
], function(VocabList) {
    /**
     * class VocabLists
     */
    var VocabLists = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(vocablist) {
                vocablist.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: VocabList
    });
    
    return VocabLists;
});
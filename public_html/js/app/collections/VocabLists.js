/**
 * @module Skritter
 * @param VocabList
 * @author Joshua McFarland
 */
define([
    'models/VocabList'
], function(VocabList) {
    /**
     * class VocabLists
     */
    var VocabLists = Backbone.Collection.extend({
        initialize: function() {
            VocabLists.this = this;
        },
        /**
         * @property {Backbone.Model} model
         */
        model: VocabList,
        /**
         * @method load
         * @param {String} sort
         * @param {Object} fieldNameMap
         * @param {Function} callback
         */
        load: function(sort, fieldNameMap, callback) {
            var fieldNames = Object.keys(fieldNameMap);
            if (fieldNames.indexOf('id'))
                fieldNames.push('id');
            skritter.api.getVocabLists(sort, fieldNames, function(lists) {
                if (lists.status === 404) {
                    if (typeof callback === 'function')
                        callback();
                } else {
                    lists = VocabLists.this.add(lists, {merge: true});
                    if (typeof callback === 'function')
                        callback(lists);
                }
            });
        }
    });
    
    return VocabLists;
});
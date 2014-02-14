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
            VocabLists.sortByAttribute = null;
        },
        /**
         * @property {Backbone.Model} model
         */
        model: VocabList,
        /**
         * @method comparator
         * @param {Backbone.Model} list
         * @return {Backbone.Model}
         */
        comparator: function(list) {
            if (VocabLists.sortByAttribute)
                return list.get(VocabLists.sortByAttribute);
        },
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
                VocabLists.this.reset();
                if (lists.status === 404) {
                    if (typeof callback === 'function')
                        callback();
                } else {
                    VocabLists.this.add(lists, {merge: true, sort: false});
                    if (typeof callback === 'function')
                        callback(VocabLists.this);
                }
            });
        },
        /**
         * @method filterByAttribute
         * @param {String} attribute
         * @param {String} value
         * @return {Backbone.Collection}
         */
        filterByAttribute: function(attribute, value) {
            return new VocabLists(this.filter(function(list) {
                if (Array.isArray(value)) {
                    return _.contains(value, list.get(attribute));
                } else {
                    return list.get(attribute) === value;
                }
            }));
        },
        /**
         * @method sortByAttribute
         * @param {String} attribute
         * @param {String} order
         * @return {Backbone.Collection}
         */
        sortByAttribute: function(attribute, order) {
            VocabLists.sortByAttribute = attribute;
            VocabLists.this.sort();
            return this;
        }
    });
    
    return VocabLists;
});
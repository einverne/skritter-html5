/**
 * @module Skritter
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
            VocabLists.this = this;
            VocabLists.sort = {attribute: 'studyingMode', order: 'asc'};
            this.on('add change', function(vocablist) {
                vocablist.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: VocabList,
        /**
         * @method comparator
         * @param {Backbone.Model} vocablist
         * @return {Backbone.Model}
         */
        comparator: function(vocablist) {
            return (VocabLists.sort.order === 'asc') ? vocablist.get(VocabLists.sort.attribute) : -vocablist.get(VocabLists.sort.attribute);
        },
        /**
         * Fetches all of the official lists from the server as well as the users current studying and custom lists.
         * 
         * @method fetchAll
         * @param {Function} callback
         */
        fetchAll: function(callback) {
            async.series([
                function(callback) {
                    skritter.api.getVocabLists('official', null, function(lists) {
                        VocabLists.this.add(lists, {merge: true, sort: false});
                        callback();
                    });
                },
                function(callback) {
                    skritter.api.getVocabLists('studying', null, function(lists) {
                        VocabLists.this.add(lists, {merge: true, sort: false});
                        callback();
                    });
                },
                function(callback) {
                    skritter.api.getVocabLists('custom', null, function(lists) {
                        VocabLists.this.add(lists, {merge: true, sort: false});
                        callback();
                    });
                },
                function(callback) {
                    skritter.storage.setItems('vocablists', VocabLists.this.toJSON(), callback);
                }
            ], function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method filterByAttribute
         * @param {Object} filter
         * @return {Backbone.Collection}
         */
        filterByAttribute: function(filter) {
            return new VocabLists(this.filter(function(vocablist) {
                if (Array.isArray(filter.value)) {
                    return _.contains(filter.value, vocablist.get(filter.attribute));
                } else {
                    return vocablist.get(filter.attribute) === filter.value;
                }
            }));
        },
        /**
         * Generates a bootstrap table based on the specificed fields, vocablists available in the collection and
         * sorted in the same order as the collection.
         * 
         * @method getTable
         * @param {Object} fields
         * @return {String}
         */
        getTable: function(fields) {
            var table = "<table id='vocab-lists-table' class='table table-hover'>";
            //table head
            table += "<thead>";
            for (var name in fields) {
                if (name === 'studyingMode') {
                    table += "<th class='text-center'>" + fields[name] + "</th>";
                } else {
                    table += "<th>" + fields[name] + "</th>";
                }
            }
            table += "</thead>";
            //table body
            table += "<tbody>";
            for (var b in this.models) {
                var vocablist = this.at(b);
                table += "<tr id='vocablist-" + vocablist.id + "' class='cursor'>";
                for (var field in fields) {
                    var value = vocablist.get(field);
                    if (field === 'studyingMode') {
                        if (value === 'not studying') {
                            table += "<td class='text-center vocablist-field-" + field + "'><span class='fa fa-circle-o'></span></td>";
                        } else if (value === 'finished') {
                            table += "<td class='text-center vocablist-field-" + field + "'><span class='fa fa-circle'></span></td>";
                        } else {
                            table += "<td class='text-center vocablist-field-" + field + "'><span class='fa fa-dot-circle-o'></span></td>";
                        }
                    } else {
                        table += "<td class='vocablist-field-" + field + "'>" + value + "</td>";
                    }
                }
                table += "</tr>";
            }
            table += "</tbody>";
            table += "</table>";
            return table;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocablists', function(vocablists) {
                skritter.data.vocablists.add(vocablists, {merge:true, silent: true, sort: false});
                callback();
            });
        },
        /**
         * @method sortByAttribute
         * @param {Object} sort
         * @return {Backbone.sort}
         */
        sortByAttribute: function(sort) {
            sort.attribute = (sort.attribute) ? sort.attribute : VocabLists.sort.attribute;
            sort.order = (sort.order) ? sort.order : VocabLists.sort.order;
            VocabLists.sort = sort;
            VocabLists.this.sort();
            return this;
        }
    });
    
    return VocabLists;
});
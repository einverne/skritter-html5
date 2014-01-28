/**
 * @module Skritter
 * @param templateVocabLists
 * @param VocabListsTable
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-lists.html',
    'views/vocabs/VocabListsTable'
], function(templateVocabLists, VocabListsTable) {
    /**
     * @class VocabListsView
     */
    var VocabLists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabLists.lists = new VocabListsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            VocabLists.lists.setElement(this.$('#vocab-lists-table-container')).load('studying', {
                'name': 'Name',
                'studyingMode': 'Status'
            }).render();
            return this;
        },
        /**
         * @method load
         * @param {String} listId
         */
        load: function(listId) {
            this.render();
        }
    });
    
    return VocabLists;
});
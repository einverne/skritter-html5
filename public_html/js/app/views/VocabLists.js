/**
 * @module Skritter
 * @param templateVocabLists
 * @param VocabListsTable
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocabs-lists.html',
    'views/components/VocabListsTable'
], function(templateVocabLists, VocabListsTable) {
    /**
     * @class VocabLists
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
            VocabLists.lists.setElement(this.$('#table-container')).load('studying', {
                'name': 'Name',
                'studyingMode': 'Status'
            }, 'name');
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
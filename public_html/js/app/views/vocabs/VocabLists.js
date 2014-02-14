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
            VocabLists.sort = 'studying';
            VocabLists.table = new VocabListsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            this.selectCategory();
            VocabLists.table.setElement(this.$('#vocab-lists-table-container')).load(VocabLists.sort, {
                'name': 'Name',
                'studyingMode': 'Status'
            }).sortByAttribute('studyingMode');
            return this;
        },
        /**
         * @method load
         * @param {String} sort
         */
        load: function(sort) {
            VocabLists.sort = (sort) ? sort : 'studying';
            this.render();
        },
        /**
         * @method selectCategory
         */
        selectCategory: function() {
            this.$('#categories a').removeClass('active');
            this.$('#' + VocabLists.sort + '-category').addClass('active');
        }
    });
    
    return VocabLists;
});
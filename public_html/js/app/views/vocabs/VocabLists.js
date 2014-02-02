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
            VocabLists.sort = 'studying';
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            this.selectCategory();
            VocabLists.lists.setElement(this.$('#vocab-lists-table-container')).load(VocabLists.sort, {
                'name': 'Name',
                'studyingMode': 'Status'
            }).render();
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
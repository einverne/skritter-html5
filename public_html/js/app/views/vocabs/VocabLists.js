/**
 * @module Skritter
 * @param templateVocabLists
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-lists.html'
], function(templateVocabLists) {
    /**
     * @class VocabListsView
     */
    var VocabLists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabLists.this = this;
            VocabLists.category = 'studying';
            VocabLists.filter = {attribute: 'studyingMode', value: ['adding', 'finished', 'reviewing']};
            VocabLists.lists = null;
            VocabLists.sort = {attribute: 'studyingMode', order: 'asc'};
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
            var vocablists = VocabLists.lists.clone();
            if (VocabLists.category) {
                this.$('#categories a').removeClass('active');
                this.$('#category-' + VocabLists.category).addClass('active');
            }
            if (VocabLists.filter)
                vocablists = vocablists.filterByAttribute(VocabLists.filter);
            if (VocabLists.sort)
                vocablists = vocablists.sortByAttribute(VocabLists.sort);
            this.$('#vocab-lists-table-container').html(vocablists.getTable({
                name: 'Name',
                studyingMode: 'Status'
            }));
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.VocabListsView #vocab-lists-view .category': 'handleCategoryClicked',
            'click.VocabListsView #vocab-lists-view .vocablist-field-name': 'handleListClicked'
        },
        /**
         * @method handleCategoryClicked
         * @param {Object} event
         */
        handleCategoryClicked: function(event) {
            VocabLists.category = event.currentTarget.id.replace('category-', '');
            if (VocabLists.category === 'studying') {
                VocabLists.this.setFilter({
                    attribute: 'studyingMode',
                    value: ['adding', 'finished', 'reviewing']
                }).setSort({
                    attribute: 'studyingMode',
                    order: 'asc'
                });
            } else {
                VocabLists.this.setFilter({
                    attribute: 'sort',
                    value: VocabLists.category
                }).setSort({
                    attribute: 'name',
                    order: 'asc'
                });
            }
            VocabLists.this.render();
            event.preventDefault();
        },
        /**
         * @method handleListClicked
         * @param {Object} event
         */
        handleListClicked: function(event) {
            var vocabListId = event.currentTarget.parentElement.id.replace('vocablist-', '');
            skritter.router.navigate('vocab/list/' + vocabListId, {trigger: true});
            event.preventDefault();
        },
        /**
         * @method load
         * @param {Object} filter
         * @param {sort} sort
         * @returns {Backbone.View}
         */
        load: function(filter, sort) {
            VocabLists.filter = (filter) ? filter : VocabLists.filter;
            VocabLists.sort = (sort) ? sort : VocabLists.sort;
            console.log(VocabLists.filter, VocabLists.sort);
            VocabLists.lists = skritter.data.vocablists;
            return this;
        },
        /**
         * @method setFilter
         * @param {Object} filter
         * @returns {Backbone.View}
         */
        setFilter: function(filter) {
            VocabLists.filter = filter;
            return this;
        },
        /**
         * @method setSort
         * @param {Object} sort
         * @returns {Backbone.View}
         */
        setSort: function(sort) {
            VocabLists.sort = sort;
            return this;
        }
    });
    
    return VocabLists;
});
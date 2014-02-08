/**
 * @module Skritter
 * @param templateVocabListSection
 * @param VocabListRowsTable
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-list-section.html',
    'views/vocabs/VocabListRowsTable'
], function(templateVocabListSection, VocabListRowsTable) {
    /**
     * @class VocabListSection
     */
    var VocabListSection = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabListSection.this = this;
            VocabListSection.rows = new VocabListRowsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListSection);
            VocabListSection.rows.setElement(this.$('#vocab-list-rows-table-container')).render();
            return this;
        },
        /**
         * @method load
         * @param {String} listId
         * @param {String} sectionId
         * @param {Function} callback
         */
        load: function(listId, sectionId, callback) {
            var list = skritter.lists.get(listId);
            if (list) {
                skritter.log.console('list exists');
                VocabListSection.this.render();
            } else {
                skritter.api.getVocabList(listId, function(list) {
                    skritter.lists.add(list, {merge: true});
                    VocabListSection.rows.set(_.find(list.sections, {id: sectionId}));
                    VocabListSection.this.render();
                });
            }
        }
    });
    
    return VocabListSection;
});
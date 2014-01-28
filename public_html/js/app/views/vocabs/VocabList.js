/**
 * @module Skritter
 * @param templateVocabList
 * @param VocabListSectionsTable
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-list.html',
    'views/vocabs/VocabListSectionsTable'
], function(templateVocabList, VocabListSectionsTable) {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabList.this = this;
            VocabList.list = null;
            VocabList.sections = new VocabListSectionsTable();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            VocabList.sections.setElement(this.$('#vocab-list-sections-table-container')).set(VocabList.list);
            return this;
        },
        /**
         * @method listId
         * @param {String} listId
         */
        load: function(listId) {
            var list = skritter.lists.get(listId);
            if (list) {
                list.load(function(list) {
                    VocabList.list = list;
                    VocabList.this.render();
                });
            } else {
                skritter.lists.add({id: listId}, {merge: true}).load(function(list) {
                    VocabList.list = list;
                    VocabList.this.render();
                });
            }
        }
    });
    
    return VocabList;
});
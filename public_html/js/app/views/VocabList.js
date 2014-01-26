/**
 * @module Skritter
 * @param templateVocabList
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocabs-list.html'
], function(templateVocabList) {
    /**
     * @class VocabList
     */
    var VocabList = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabList.this = this;
            VocabList.id = null;
            VocabList.list = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            this.$('#list-name').html(VocabList.list.name);
            this.$('#list-description').html(VocabList.list.description);
            return this;
        },
        /**
         * @method listId
         * @param {String} listId
         */
        load: function(listId) {
            VocabList.id = listId;
            skritter.api.getVocabList(listId, function(list) {
                VocabList.list = list;
                VocabList.this.render();
            });
        }
    });
    
    return VocabList;
});
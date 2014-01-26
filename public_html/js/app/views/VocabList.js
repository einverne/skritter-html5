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
            VocabList.id = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabList);
            return this;
        },
        /**
         * @method listId
         * @param {String} listId
         */
        load: function(listId) {
            VocabList.id = listId;
            this.render();
        }
    });
    
    return VocabList;
});
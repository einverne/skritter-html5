/**
 * @module Skritter
 * @param templateVocabLists
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocabs-lists.html'
], function(templateVocabLists) {
    /**
     * @class VocabLists
     */
    var VocabLists = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabLists);
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
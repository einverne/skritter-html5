/**
 * @module Skritter
 * @param templateVocabList
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-list.html'
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
         * @method load
         * @param {String} listId
         * @returns {Backbone.View}
         */
        load: function(listId) {
            return this;
        }
    });
    
    return VocabList;
});
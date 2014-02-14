/**
 * @module Skritter
 * @param templateVocabListSection
 * @author Joshua McFarland
 */
define([
    'require.text!templates/vocab-list-section.html'
], function(templateVocabListSection) {
    /**
     * @class VocabListSection
     */
    var VocabListSection = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabListSection.this = this;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabListSection);
            return this;
        },
        /**
         * @method load
         * @param {String} listId
         * @param {String} sectionId
         * @returns {Backbone.View}
         */
        load: function(listId, sectionId) {
            return this;
        }
    });
    
    return VocabListSection;
});
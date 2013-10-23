/**
 * @module Skritter
 * @submodule View
 * @param templateVocabWords
 * @author Joshua McFarland
 */
define([
    'require.text!template/vocab-words.html',
    'backbone'
], function(templateVocabWords) {
    /**
     * @class Words
     */
    var Words = Backbone.View.extend({
        render: function() {
            this.$el.html(templateVocabWords);
            return this;
        }
        
    });
    
    return Words;
});
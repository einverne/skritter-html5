/**
 * @module Skritter
 * @submodule View
 * @param VocabWords
 * @param templateVocab
 * @author Joshua McFarland
 */
define([
    'component/Words',
    'require.text!template/vocab.html',
    'backbone'
], function(VocabWords, templateVocab) {
    /**
     * @class Vocab
     */
    var Vocab = Backbone.View.extend({
        render: function() {
            this.$el.html(templateVocab);
            new VocabWords().setElement(this.$('#vocab-display')).render();
            return this;
        }
        
    });
    
    
    return Vocab;
});
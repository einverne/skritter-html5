/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'views/components/ContainedTable',
    'SimpTradMap',
    'require.text!templates/info.html'
], function(ContainedTable, SimpTradMap, templateInfo) {
    var Info = Backbone.View.extend({
        initialize: function() {
            Info.this = this;
            Info.containedTable = new ContainedTable();
            Info.vocab = null;
        },
        render: function() {
            this.$el.html(templateInfo);
            console.log('INFO', Info.vocab);
            /*Info.containedTable.set();
            Info.containedTable.setElement(this.$('#contained')).render();*/
            return this;
        },
        load: function(lang, writing) {
            var vocabId = SimpTradMap.getVocabBase(writing, lang);
            skritter.data.vocabs.load(vocabId, function(vocab) {
                Info.vocab = vocab;
                Info.this.render();
            });
        }
    });
    
    return Info;
});
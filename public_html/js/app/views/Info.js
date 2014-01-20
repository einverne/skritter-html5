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
            Info.containedTable = new ContainedTable();
            Info.vocab = null;
        },
        render: function() {
            this.$el.html(templateInfo);
            /*Info.containedTable.set();
            Info.containedTable.setElement(this.$('#contained')).render();*/
            return this;
        },
        set: function(writing) {
            var vocabId = SimpTradMap.getVocabBase(writing, 'zh');
            Info.vocab = skritter.data.vocabs.get(vocabId);
        }
    });
    
    return Info;
});
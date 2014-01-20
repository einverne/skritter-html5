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
            Info.contained = [];
            Info.containedTable = new ContainedTable();
            Info.vocab = null;
        },
        render: function() {
            this.$el.html(templateInfo);
            this.$('#writing').html(Info.vocab.get('writing'));
            this.$('#reading').html(Info.vocab.getReading());
            this.$('#definition').html(Info.vocab.getDefinition());
            var sentence = Info.vocab.getSentence();
            if (sentence) {
                this.$('#sentence-writing').html(sentence.getWriting());
                this.$('#sentence-reading').html(sentence.getReading());
                this.$('#sentence-definition').html(sentence.getDefinition());
            };
            Info.containedTable.set(Info.contained);
            Info.containedTable.setElement(this.$('#contained')).render();
            return this;
        },
        load: function(lang, writing) {
            var vocabId = SimpTradMap.getVocabBase(writing, lang);
            skritter.data.vocabs.load(vocabId, function(vocab) {
                Info.vocab = vocab;
                if (vocab.has('containedVocabIds')) {
                    vocab.loadContainedVocabs(function(contained) {
                        Info.contained = contained;
                        Info.this.render();
                    });
                } else {
                    Info.this.render();
                }
            });
        }
    });
    
    return Info;
});
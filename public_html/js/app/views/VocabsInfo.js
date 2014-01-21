/**
 * @module Skritter
 * @param ContainedTable
 * @param DecompTable
 * @param SimpTradMap
 * @param templateVocabsInfo
 * @author Joshua McFarland
 */
define([
    'views/components/ContainedTable',
    'views/components/DecompTable',
    'SimpTradMap',
    'require.text!templates/vocabs-info.html'
], function(ContainedTable, DecompTable, SimpTradMap, templateVocabsInfo) {
    var VocabsInfo = Backbone.View.extend({
        initialize: function() {
            VocabsInfo.this = this;
            VocabsInfo.contained = [];
            VocabsInfo.containedTable = new ContainedTable();
            VocabsInfo.decompTable = new DecompTable();
            VocabsInfo.vocab = null;
        },
        render: function() {
            this.$el.html(templateVocabsInfo);
            this.$('#writing').html(VocabsInfo.vocab.get('writing'));
            this.$('#reading').html(VocabsInfo.vocab.getReading());
            this.$('#definition').html(VocabsInfo.vocab.getDefinition());
            var sentence = VocabsInfo.vocab.getSentence();
            if (sentence) {
                this.$('#sentence-writing').html(sentence.getWriting());
                this.$('#sentence-reading').html(sentence.getReading());
                this.$('#sentence-definition').html(sentence.getDefinition());
            }
            VocabsInfo.containedTable.set(VocabsInfo.contained);
            VocabsInfo.containedTable.setElement(this.$('#contained')).render();
            VocabsInfo.decompTable.set(VocabsInfo.vocab.getDecomps());
            VocabsInfo.decompTable.setElement(this.$('#decompositions')).render();
            return this;
        },
        load: function(lang, writing) {
            var vocabId = SimpTradMap.getVocabBase(writing, lang);
            skritter.data.vocabs.load(vocabId, function(vocab) {
                VocabsInfo.vocab = vocab;
                if (vocab.has('containedVocabIds')) {
                    vocab.loadContainedVocabs(function(contained) {
                        VocabsInfo.contained = contained;
                        VocabsInfo.this.render();
                    });
                } else {
                    VocabsInfo.this.render();
                }
            });
        }
    });
    
    return VocabsInfo;
});
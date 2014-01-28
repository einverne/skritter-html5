/**
 * @module Skritter
 * @param ContainedTable
 * @param DecompTable
 * @param SimpTradMap
 * @param templateVocabInfo
 * @author Joshua McFarland
 */
define([
    'views/components/ContainedTable',
    'views/components/DecompTable',
    'SimpTradMap',
    'require.text!templates/vocab-info.html'
], function(ContainedTable, DecompTable, SimpTradMap, templateVocabInfo) {
    /**
     * @class VocabInfoView
     * @type @exp;Backbone@pro;View@call;extend
     */
    var VocabInfo = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            VocabInfo.this = this;
            VocabInfo.contained = [];
            VocabInfo.containedTable = new ContainedTable();
            VocabInfo.decompTable = new DecompTable();
            VocabInfo.vocab = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateVocabInfo);
            this.$('#writing').html(VocabInfo.vocab.get('writing'));
            this.$('#reading').html(VocabInfo.vocab.getReading());
            this.$('#definition').html(VocabInfo.vocab.getDefinition());
            var sentence = VocabInfo.vocab.getSentence();
            if (sentence) {
                this.$('#sentence-writing').html(sentence.getWriting());
                this.$('#sentence-reading').html(sentence.getReading());
                this.$('#sentence-definition').html(sentence.getDefinition());
            }
            VocabInfo.containedTable.set(VocabInfo.contained);
            VocabInfo.containedTable.setElement(this.$('#contained')).render();
            VocabInfo.decompTable.set(VocabInfo.vocab.getDecomps());
            VocabInfo.decompTable.setElement(this.$('#decompositions')).render();
            return this;
        },
        /**
         * @method load
         * @param {String} lang
         * @param {String} writing
         * @param {Function} callback
         */
        load: function(lang, writing, callback) {
            var vocabId = SimpTradMap.getVocabBase(writing, lang);
            skritter.data.vocabs.load(vocabId, function(vocab) {
                VocabInfo.vocab = vocab;
                if (vocab.has('containedVocabIds')) {
                    vocab.loadContainedVocabs(function(contained) {
                        VocabInfo.contained = contained;
                        VocabInfo.this.render();
                    });
                } else {
                    VocabInfo.this.render();
                }
                if (typeof callback === 'function')
                    callback();
            });
        }
    });
    
    return VocabInfo;
});
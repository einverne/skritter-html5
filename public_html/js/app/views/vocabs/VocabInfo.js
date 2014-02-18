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
            this.$('#writing').addClass(VocabInfo.vocab.getTextStyleClass());
            this.$('#sentence-writing').addClass(VocabInfo.vocab.getTextStyleClass());
            this.$('#writing').html(VocabInfo.vocab.get('writing'));
            this.$('#reading').html(VocabInfo.vocab.getReading());
            this.$('#definition').html(VocabInfo.vocab.getDefinition(skritter.user.getSetting('showHeisig')));
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
        events: {
            'click.VocabInfo #vocab-info-view #audio-button': 'playAudio',
            'click.VocabInfo #vocab-info-view .back-button': 'handleBackClicked',
            'click.VocabInfo #vocab-info-view #ban-button': 'handleBanClicked',
            'click.VocabInfo #vocab-info-view .home-button': 'handleHomeClicked',
            'click.VocabInfo #vocab-info-view #star-button': 'handleStarClicked'
        },
        /**
         * @method handleBackClicked
         * @param {Object} event
         */
        handleBackClicked: function(event) {
            skritter.router.back();
            event.preventDefault();
        },
        /**
         * @method handleBanClicked
         * @param {Object} event
         */
        handleBanClicked: function(event) {
            //TODO: requires specific api functionality to update
            event.preventDefault();
        },
        /**
         * @method handleHomeClicked
         * @param {Object} event
         */
        handleHomeClicked: function(event) {
            skritter.router.navigate('/', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method handleStarClicked
         * @param {Object} event
         */
        handleStarClicked: function(event) {
            //TODO: requires specific api functionality to update
            event.preventDefault();
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
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            VocabInfo.vocab.play();
            event.preventDefault();
        }
    });
    
    return VocabInfo;
});
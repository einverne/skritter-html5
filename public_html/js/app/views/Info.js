/**
 * @module Skritter
 * @submodule Views
 * @param PinyinConverter
 * @param templateInfo
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'require.text!templates/info.html',
    'backbone'
], function(PinyinConverter, templateInfo) {
    /**
     * @class Info
     */
    var Info = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Info.vocab = null;
            Info.sentence = null;
        },
        /**
         * @method render
         * @return {Backbone.View}
         */
        render: function() {
            this.$el.html(templateInfo);

            this.$('#writing').text(Info.vocab.get('writing'));
            this.$('#writing').addClass(skritter.user.getTextStyle());
            this.$('#reading').text(PinyinConverter.toTone(Info.vocab.get('reading')));
            this.$('#definition').text(Info.vocab.get('definitions')[skritter.user.getSetting('sourceLang')]);
            this.$('#mnemonic').text(Info.vocab.get('mnemonic'));
            this.$('#sentence').text(Info.sentence.get('writing').replace(/\s+/g, ''));
            this.$('#sentence').addClass(skritter.user.getTextStyle());

            return this;
        },
        /**
         * @method set
         * @param {String} vocabId
         */
        set: function(vocabId) {
            Info.vocab = skritter.data.vocabs.findWhere({id: vocabId});
            if (Info.vocab.has('sentenceId'))
                Info.sentence = skritter.data.sentences.findWhere({id: Info.vocab.get('sentenceId')});
        }
    });

    return Info;
});
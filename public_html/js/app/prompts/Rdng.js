/**
 * @module Skritter
 * @submodule Prompts
 * @param PinyinConverter
 * @param Prompt
 * @param templateRdng
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'prompts/Prompt',
    'require.text!templates/prompts-rdng.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Prompt, templateRdng) {
    /**
     * @class PromptRdng
     */
    var Rdng = Prompt.extend({
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        render: function() {
            this.$el.html(templateRdng);
            this.$('#prompt-text').hammer().on('swipeleft.Rdng', _.bind(this.handleSwipeLeft, this));
            this.$('#prompt-text').hammer().on('tap.Rdng', _.bind(this.handleTap, this));
            Prompt.prototype.render.call(this);
            return this;
        },
        /*
         * @method handleSwipeLeft
         */
        handleSwipeLeft: function() {
            if (Prompt.finished)
                this.next();
        },
        /*
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.finished) {
                this.next();
            } else {
                this.showAnswer();
                Prompt.gradingButtons.show();
            }
        },
        show: function() {
            skritter.timer.start();
            this.$('.prompt-writing').text(Prompt.writing);
            if (skritter.user.isChinese())
                this.$('.prompt-style').text(Prompt.vocab.get('style'));
            this.$('.prompt-style').text(Prompt.vocab.get('style'));
            if (Prompt.sentence) {
                this.$('.prompt-sentence').text(Prompt.sentence.noWhiteSpaces());
            } else {
                this.$('#prompt-sentence-row').hide();
            }
            if (Prompt.mnemonic) {
                this.$('.prompt-mnemonic').text(Prompt.mnemonic.text + ' (' + Prompt.mnemonic.creator + ')');
            } else {
                this.$('.prompt-mnemonic').hide();
            }
            this.$('#prompt-text .prompt-reading').text("What's the reading?");
            this.$('#tip').text("(Click to show answer)");
        },
        showAnswer: function() {
            skritter.timer.stop();
            Prompt.finished = true;
            Prompt.gradingButtons.show();
            if (Prompt.vocab.has('audio') && this.isLast() && skritter.user.get('audio'))
                Prompt.vocab.play();
            this.$('.prompt-reading').text(PinyinConverter.toTone(Prompt.reading));
            if (skritter.user.getSetting('showHeisig') && Prompt.vocab.has('heisigDefinition'))
                this.$('.prompt-heisig').text(Prompt.vocab.get('heisigDefinition'));
            this.$('.prompt-definition').html(Prompt.definition);
            this.$('#tip').hide();
        }
    });
    
    return Rdng;
});
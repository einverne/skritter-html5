/**
 * @module Skritter
 * @submodule Prompts
 * @param PinyinConverter
 * @param Prompt
 * @param templateDefn
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'prompts/Prompt',
    'require.text!templates/prompts-defn.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Prompt, templateDefn) {
    /**
     * @class PromptDefn
     */
    var Defn = Prompt.extend({
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        render: function() {
            this.$el.html(templateDefn);
            this.$('#prompt-text').hammer().on('swipeleft.Defn', _.bind(this.handleSwipeLeft, this));
            this.$('#prompt-text').hammer().on('tap.Defn', _.bind(this.handleTap, this));
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
            if (Prompt.vocab.has('audio') && this.isFirst() && skritter.user.get('audio'))
                Prompt.vocab.play();
            if (skritter.user.isChinese())
                this.$('.prompt-style').text(Prompt.vocab.get('style'));
            if (Prompt.mnemonic) {
                this.$('.prompt-mnemonic').text(Prompt.mnemonic.text + ' (' + Prompt.mnemonic.creator + ')');
            } else {
                this.$('.prompt-mnemonic').hide();
            }
            this.$('#prompt-text .prompt-definition').text("What's the definition?");
            this.$('#prompt-text #tip').text("(Click to show answer)");
        },
        showAnswer: function() {
            skritter.timer.stop();
            Prompt.finished = true;
            Prompt.gradingButtons.show();
            this.$('.prompt-reading').text(PinyinConverter.toTone(Prompt.reading));
            this.$('#prompt-text .prompt-definition').text(Prompt.definition);
            if (Prompt.sentence) {
                this.$('.prompt-sentence').text(Prompt.sentence.noWhiteSpaces());
            } else {
                this.$('#prompt-sentence-row').hide();
            }
            this.$('#tip').hide();
        }
    });
    
    return Defn;
});
/**
 * @module Skritter
 * @submodule Prompt
 * @param PinyinConverter
 * @param Prompt
 * @param templateRdng
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'prompt/Prompt',
    'require.text!template/prompt-rdng.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Prompt, templateRdng) {
    /**
     * @class PromptRdng
     */
    var Rdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Skritter.timer.setReviewLimit(30000);
            Skritter.timer.setThinkingLimit(15000);
        },
        /**
         * @method render
         * @returns {PromptRdng}
         */
        render: function() {
            this.$el.html(templateRdng);
            this.resize();
            return this;
        },
        /**
         * @method handleClick
         */
        handleClick: function() {
            this.showGrading();
            this.showAnswer();
        },
        /**
         * @method handleGradeSelected
         * @param {String} selected
         */
        handleGradeSelected: function(selected) {
            Prompt.grade = selected;
            this.next();
        },
        /**
         * Handles either the swipeleft or tap events by moving to the next if the
         * prompt has already been finished.
         * 
         * @method handleIfFinished
         */
        handleIfFinished: function() {
            if (Prompt.finished) {
                Prompt.buttons.remove();
                this.next();
            }
        },
        /**
         * @method next
         */
        next: function() {
            this.pushResult(Prompt.grade, Skritter.timer.getReviewTime(), Skritter.timer.getStartTime(), Skritter.timer.getThinkingTime());
            this.triggerPromptComplete();
        },
        /**
         * @method show
         */
        show: function() {
            console.log('Prompt', 'RDNG', Prompt.vocabs[0].get('writing'));
            Skritter.timer.start();
            this.$('#writing').text(Prompt.writing);
            this.$('#style').text(Prompt.vocabs[0].get('style'));
            this.$('#reading').text("What's the reading?");
            this.$('#prompt-tip').text("(Click to show answer)");
            this.$('#canvas-container').hammer().one('tap.Rdng', _.bind(this.handleClick, this));
        },
        /**
         * @method showAnswer
         */
        showAnswer: function() {
            Skritter.timer.stop();
            Prompt.finished = true;
            this.$('#reading').text(PinyinConverter.toTone(Prompt.reading));
            this.$('#definition').text(Prompt.definition);
            if (Prompt.sentence)
                this.$('#sentence').text(Prompt.sentence);
            this.$('#prompt-tip').hide();
            //play the audio file when answer is shown
            if (Prompt.vocabs[0].has('audio') && Skritter.user.get('audio'))
                Prompt.vocabs[0].play();
            //events
            this.$('#canvas-container').hammer().one('swipeleft.Rdng', _.bind(this.handleIfFinished, this));
            this.$('#canvas-container').hammer().one('tap.Rdng', _.bind(this.handleIfFinished, this));
        }
    });
    
    
    return Rdng;
});
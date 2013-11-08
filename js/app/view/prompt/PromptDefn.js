/**
 * @module Skritter
 * @submodule Prompt
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'prompt/Prompt',
    'require.text!template/prompt-defn.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Prompt, templateDefn) {
    /**
     * @class PromptDefn
     */
    var Defn = Prompt.extend({
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Skritter.timer.setReviewLimit(30000);
            Skritter.timer.setThinkingLimit(15000);
        },
        render: function() {
            this.$el.html(templateDefn);
            this.resize();
            return this;
        },
        handleClick: function() {
            Prompt.finished = true;
            this.showGrading();
            this.showAnswer();
        },
        handleGradeSelected: function(selected) {
            Prompt.grade = selected;
            this.next();
        },
        next: function() {
            this.pushResult(Prompt.grade, Skritter.timer.getReviewTime(), Skritter.timer.getStartTime(), Skritter.timer.getThinkingTime());
            this.triggerPromptComplete();
        },
        show: function() {
            console.log('Prompt', 'DEFN', Prompt.vocabs[0].get('writing'));
            Skritter.timer.start();
            this.$('#writing').text(Prompt.writing);
            this.$('#style').text(Prompt.vocabs[0].get('style'));
            this.$('#definition').text("What's the definition?");
            this.$('#prompt-tip').text("(Click to show answer)");
            this.$('#canvas-container').hammer().one('click.Defn', _.bind(this.handleClick, this));
        },
        showAnswer: function() {
            Skritter.timer.stop();
            this.$('#reading').text(PinyinConverter.toTone(Prompt.reading));
            this.$('#definition').text(Prompt.definition);
            this.$('#sentence').text(Prompt.sentence);
            this.$('#prompt-tip').hide();
            //play the audio file when answer is shown
            if (Prompt.vocabs[0].has('audio') && Skritter.user.get('audio'))
                Prompt.vocabs[0].play();
        }
    });


    return Defn;
});
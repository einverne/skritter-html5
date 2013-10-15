/**
 * @module Skritter
 * @submodule Prompt
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
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Skritter.timer.setReviewLimit(30000);
            Skritter.timer.setThinkingLimit(15000);
        },
        render: function() {
            this.$el.html(templateRdng);
            this.resize();
            return this;
        },
        handleClick: function() {
            Rdng.finished = true;
            this.showGrading();
            this.showAnswer();
        },
        handleGradeSelected: function(selected) {
            Rdng.grade = selected;
            this.triggerPromptComplete();
        },
        showAnswer: function() {
            Skritter.timer.stop();
            this.$('#reading').text(PinyinConverter.toTone(Prompt.reading));
            this.$('#definition').text(Prompt.definition);
            this.$('#sentence').text(Prompt.sentence);
            this.$('#prompt-tip').hide();
        },
        showHidden: function() {
            console.log('Prompt', 'RDNG', Prompt.vocabs[0].get('writing'));
            Skritter.timer.start();
            this.$('#writing').text(Prompt.writing);
            this.$('#reading').text("What's the reading?");
            this.$('#prompt-tip').text("(Click to show answer)");
            this.$('#canvas-container').hammer().one('click.Rdng', _.bind(this.handleClick, this));
        }
    });
    
    
    return Rdng;
});
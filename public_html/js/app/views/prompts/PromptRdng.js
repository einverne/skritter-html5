/**
 * @module Skritter
 * @param templateRdng
 * @param LeapController
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-rdng.html',
    'models/LeapController',
    'views/prompts/Prompt'
], function(templateRdng, LeapController, Prompt) {
    /**
     * @class PromptRdng
     */
    var Rdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Rdng.leap = new LeapController();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRdng);
            hammer(this.$('#prompt-text')[0]).on('tap', this.handleTap);
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished()) {
                Prompt.this.handleGradeSelected(Prompt.gradingButtons.grade());
            } else {
                Prompt.dataItem.set('finished', true);
                skritter.timer.stopThinking();
                Prompt.this.load();
            }
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Prompt.data.show.style();
            Prompt.data.show.tip("What's the reading?");
            Prompt.data.show.writing();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                Prompt.data.hide.tip();
                Prompt.data.show.definition();
                Prompt.data.show.reading();
                Prompt.gradingButtons.show();
            } else {
                skritter.timer.start();
            }
        }
    });

    return Rdng;
});
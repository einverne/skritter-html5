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
         * @method handleGradeSelected
         */
        handleGradeSelected: function() {
            this.updateColor();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished()) {
                Prompt.this.next();
            } else {
                skritter.timer.stopThinking();
                Prompt.dataItem.set('finished', true);
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
                this.updateColor();
                Prompt.data.hide.tip();
                Prompt.data.show.definition();
                Prompt.data.show.reading();
                Prompt.gradingButtons.show();
            } else {
                skritter.timer.start();
            }
        },
        /**
         * Updates the prompt color based on the current selected grade value.
         * 
         * @method updateColor
         */
        updateColor: function() {
            Prompt.this.$('.prompt-reading').removeClass(function(index, css) {
                return (css.match(/\bgrade\S+/g) || []).join(' ');
            });
            Prompt.this.$('.prompt-reading').addClass('grade' + Prompt.gradingButtons.grade());
        }
    });

    return Rdng;
});
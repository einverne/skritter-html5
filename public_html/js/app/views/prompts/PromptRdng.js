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
            //this.updateColor();
            Prompt.this.next();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished()) {
                Prompt.this.next();
            } else {
                skritter.timer.stopThinking();
                //sets the item as finished and initial review values
                Prompt.dataItem.set('finished', true);
                Prompt.dataItem.setReview(Prompt.gradingButtons.grade(), skritter.timer.getReviewTime(), skritter.timer.getThinkingTime());
                Prompt.this.load();
            }
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Prompt.data.hide.definition();
            Prompt.data.hide.mnemonic();
            Prompt.data.hide.sentence();
            Prompt.data.show.style();
            Prompt.data.show.writing();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                //this.updateColor();
                Prompt.data.hide.tip();
                Prompt.data.show.definition();
                Prompt.data.hide.question();
                Prompt.data.show.reading();
                Prompt.gradingButtons.show();
                if (skritter.user.get('audio'))
                    Prompt.data.vocab.play();
            } else {
                skritter.timer.start();
                Prompt.data.show.question("What is the reading?");
                Prompt.data.show.tip("(Click to show the answer)");
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
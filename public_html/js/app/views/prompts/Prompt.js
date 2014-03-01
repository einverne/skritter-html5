/**
 * @module Skritter
 * @submodule Views
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'views/prompts/GradingButtons'
], function(GradingButtons) {
    /**
     * @class Prompt
     */
    var Prompt = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.this = this;
            Prompt.gradingButton = new GradingButtons();
            Prompt.review = null;
            this.listenTo(skritter.settings, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.display();
            this.resize();
            return this;
        },
        /**
         * @property {Object} hide
         */
        hide: {
            sentence: function() {
                Prompt.this.$('.prompt-sentence').parent().show();
            }
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            if (settings.orientation() === 'landscape') {
                this.$('#info-container').width(settings.width() - this.$('#input-container').width() - 2);
                this.$('#info-container').height(settings.height());
            } else {
                this.$('#info-container').width(settings.width());
                this.$('#info-container').height(settings.height() - this.$('#input-container').height() - 2);

            }
            
        },
        /**
         * @method set
         * @param review
         * @returns {Backbone.View}
         */
        set: function(review) {
            Prompt.review = review;
            return this;
        },
        /**
         * @property {Object} show
         */
        show: {
            definition: function() {
                Prompt.this.$('.prompt-definition').html(Prompt.review.vocab.definition());
            },
            reading: function(offset, mask) {
                Prompt.this.$('.prompt-reading').html(Prompt.review.vocab.reading(offset, mask));
            },
            sentence: function() {
                if (Prompt.review.vocab.sentence()) {
                    Prompt.this.$('.prompt-sentence').html(Prompt.review.vocab.sentence().get('writing'));
                } else {
                    Prompt.this.$('.prompt-sentence').parent().show();
                }
            },
            writing: function(offset) {
                Prompt.this.$('.prompt-writing').html(Prompt.review.vocab.writing(offset));
            }
        }
    });
    
    return Prompt;
});
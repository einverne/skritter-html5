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
            Prompt.review = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            return this;
        },
        /**
         * @property {Object} hide
         */
        hide: {  
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
            reading: function(offset) {
                Prompt.this.$('.prompt-reading').html(Prompt.review.vocab.reading(offset));
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
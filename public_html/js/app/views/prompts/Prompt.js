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
         * @method hideDefinition
         * @returns {Backbone.View}
         */
        hideDefinition: function() {
            this.$('.prompt-definition').parent().hide();
            return this;
        },
        /**
         * @method hideMnemonic
         * @returns {Backbone.View}
         */
        hideMnemonic: function() {
            this.$('.prompt-mnemonic').parent().hide();
            return this;
        },
        /**
         * @method hideReading
         * @returns {Backbone.View}
         */
        hideReading: function() {
            this.$('.prompt-reading').parent().hide();
            return this;
        },
        /**
         * @method hideSentence
         * @returns {Backbone.View}
         */
        hideSentence: function() {
            this.$('.prompt-sentence').parent().hide();
            return this;
        },
        /**
         * @method hideWriting
         * @returns {Backbone.View}
         */
        hideWriting: function() {
            this.$('.prompt-writing').parent().hide();
            return this;
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
            console.log('PROMPT', review);
            Prompt.review = review;
            return this;
        },
        /**
         * @method showDefinition
         * @returns {Backbone.View}
         */
        showDefinition: function() {
            this.$('.prompt-definition').html(Prompt.review.vocab().definition());
            return this;
        },
        /**
         * @method showMnemonic
         * @returns {Backbone.View}
         */
        showMnemonic: function() {
            if (Prompt.review.vocab().has('mnemonic')) {
                this.$('.prompt-mnemonic').html(Prompt.review.vocab().mnemonic());
                this.$('.prompt-mnemonic').parent().show();
            } else {
                this.hide.mnemonic();
            }
            return this;
        },
        /**
         * @method showReading
         * @param {Number} offset
         * @param {Boolean} mask
         * @returns {Backbone.View}
         */
        showReading: function(offset, mask) {
            this.$('.prompt-reading').html(Prompt.review.vocab().reading(offset, mask));
            return this;
        },
        /**
         * @method showSentence
         * @returns {Backbone.View}
         */
        showSentence: function() {
            if (Prompt.review.vocab().has('sentenceId')) {
                this.$('.prompt-sentence').html(Prompt.review.vocab().sentence().get('writing'));
            } else {
                this.$('.prompt-sentence').parent().show();
            }
            return this;
        },
        /**
         * @method showWriting
         * @param {Number} offset
         * @returns {Backbone.View}
         */
        showWriting: function(offset) {
            this.$('.prompt-writing').html(Prompt.review.vocab().writing(offset));
            return this;
        }
    });

    return Prompt;
});
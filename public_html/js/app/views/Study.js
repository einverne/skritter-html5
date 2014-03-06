/**
 * @module Skritter
 * @submodule Views
 * @param templateStudy
 * @param Defn
 * @param Rdng
 * @param Rune
 * @param Tone
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study.html',
    'views/prompts/Defn',
    'views/prompts/Rdng',
    'views/prompts/Rune',
    'views/prompts/Tone'
], function(templateStudy, Defn, Rdng, Rune, Tone) {
    /**
     * @class Study
     */
    var Study = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.index = -1;
            this.review = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudy);
            skritter.user.scheduler.filter({ids: ['mcfarljwtest2-zh-幼儿-1-rune']});
            //skritter.user.scheduler.filter({parts: ['rune']});
            if (this.review) {
                this.loadPrompt(Study.review);
            } else {
                this.nextPrompt();
            }
            return this;
        },
        /**
         * @method loadPrompt
         * @param {Backbone.Model} review
         */
        loadPrompt: function(review) {
            switch (review.item().get('part')) {
                case 'defn':
                    Study.prompt = new Defn();
                    break;
                case 'rdng':
                    Study.prompt = new Rdng();
                    break;
                case 'rune':
                    Study.prompt = new Rune();
                    break;
                case 'tone':
                    Study.prompt = new Tone();
                    break;
            }
            Study.prompt.setElement(this.$('.prompt-container'));
            Study.prompt.set(review).render();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            var self = this;
            this.index = this.index < 0 ? -1 : this.index - 1;
            if (this.index === -1) {
                if (this.review)
                    this.review.save();
                skritter.user.scheduler.next(function(item) {
                    self.review = item.createReview();
                    self.loadPrompt(self.review);
                });
            } else {
                skritter.user.data.reviews.load(this.index, function(review) {
                    self.review = review;
                    self.loadPrompt(self.review);
                });
            }
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            var self = this;
            skritter.user.data.reviews.load(this.index + 1, function(review) {
                if (review) {
                    self.review = review;
                    self.loadPrompt(self.review);
                    self.index++;
                } else {
                    console.log('UNABLE TO GO BACK!');
                }
            });
        }
    });

    return Study;
});
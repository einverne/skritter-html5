/**
 * @module Skritter
 * @submodule Views
 * @param templateStudy
 * @param Rune
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study.html',
    'views/prompts/Rune'
], function(templateStudy, Rune) {
    /**
     * @class Study
     */
    var Study = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Study.this = this;
            Study.review = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudy);
            //skritter.user.scheduler.filter({ids: ['mcfarljwtest2-zh-幼儿-1-rune']});
            //skritter.user.scheduler.filter({parts: ['rune']});
            if (Study.prompt) {
                this.loadPrompt();
            } else {
                this.nextPrompt();
            }
            return this;
        },
        loadPrompt: function(review) {
            switch (review.item.get('part')) {
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
        nextPrompt: function() {
            skritter.user.scheduler.next(function(item) {
                Study.review = item.createReview();
                Study.this.loadPrompt(Study.review);
            });
        },
        previousPrompt: function() {
            
        }
    });
    
    return Study;
});
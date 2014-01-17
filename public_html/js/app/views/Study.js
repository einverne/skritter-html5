/**
 * @module Skritter
 * @param templateStudy
 * @param PromptRune
 * @param PromptTone
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study.html',
    'views/prompts/PromptRune',
    'views/prompts/PromptTone'
], function(templateStudy, PromptRune, PromptTone) {
    /**
     * @class Study
     */
    var Study = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Study.this = this;
            Study.history = [];
            Study.prompt = null;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudy);
            //skritter.scheduler.filter({ids: ['mcfarljwtest1-zh-好好学习-0-rune']});
            skritter.scheduler.filter({parts: ['rune', 'tone']});
            skritter.timer.setElement(this.$('#timer')).render();
            this.updateDueCount();
            if (Study.prompt) {
                this.loadPrompt();
            } else {
                this.nextPrompt();
            }
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Study #study-view #next-button': 'nextPrompt',
            'click.Study #study-view #previous-button': 'previousPrompt'
        },
        handlePromptComplete: function(data) {
            console.log('prompt complete', data);
            this.nextPrompt();
        },
        loadPrompt: function() {
            Study.prompt.setElement(this.$('#prompt-container'));
            Study.prompt.render().load();
        },
        nextPrompt: function() {
            console.log('NEXT');
            if (!Study.prompt || Study.prompt.data().isLast()) {
                skritter.scheduler.getNext(function(item) {
                    switch (item.get('part')) {
                        case 'defn':
                            break;
                        case 'rdng':
                            break;
                        case 'rune':
                            Study.prompt = new PromptRune();
                            break;
                        case 'tone':
                            Study.prompt = new PromptTone();
                            break;
                    }
                    Study.prompt.set(item.getPromptData());
                    Study.this.listenToOnce(Study.prompt, 'complete', Study.this.handlePromptComplete);
                    Study.this.loadPrompt();
                });
            } else {
                Study.prompt.next();
            }
        },
        previousPrompt: function() {
            console.log('PREVIOUS');
            if (Study.prompt)
                if (Study.prompt.data().isFirst()) {
                    console.log('no historic prompt');
                } else {
                    Study.prompt.previous();
                }
        },
        updateDueCount: function() {
            this.$('#items-due').text(skritter.scheduler.getDueCount());
        }
    });
    
    return Study;
});
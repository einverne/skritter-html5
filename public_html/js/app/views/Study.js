/**
 * @module Skritter
 * @param templateStudy
 * @param PromptDefn
 * @param PromptRdng
 * @param PromptRune
 * @param PromptTone
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study.html',
    'views/prompts/PromptDefn',
    'views/prompts/PromptRdng',
    'views/prompts/PromptRune',
    'views/prompts/PromptTone'
], function(templateStudy, PromptDefn, PromptRdng, PromptRune, PromptTone) {
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
            //skritter.scheduler.filter({ids: ['mcfarljwtest3-ja-～ヶ月-0-rune']});
            //skritter.scheduler.filter({parts: ['rdng']});
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
            'click.Study #study-view #audio-button': 'playAudio',
            'click.Study #study-view #info-button': 'navigateVocabsInfo'
        },
        /**
         * @method clearPrompt
         * @returns {Backbone.View}
         */
        clearPrompt: function() {
            Study.prompt = null;
            return this;
        },
        /**
         * @method handlePromptComplete
         */
        handlePromptComplete: function() {
            Study.history.push(Study.prompt);
            this.nextPrompt();
        },
        loadPrompt: function() {
            Study.prompt.setElement(this.$('#prompt-container'));
            Study.prompt.render().load();
        },
        /**
         * @method navigateVocabsInfo
         * @param {Object} event
         */
        navigateVocabsInfo: function(event) {
            if (Study.prompt)
                skritter.router.navigate('vocabs/' + Study.prompt.data().vocab.get('lang') + '/' + Study.prompt.data().vocab.get('writing'), {trigger: true});
            event.preventDefault();
        },
        nextPrompt: function() {
            if (!Study.prompt || Study.prompt.data().isLast()) {
                skritter.scheduler.getNext(function(item) {
                    switch (item.get('part')) {
                        case 'defn':
                            Study.prompt = new PromptDefn();
                            break;
                        case 'rdng':
                            Study.prompt = new PromptRdng();
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
                    Study.this.listenToOnce(Study.prompt, 'previous', Study.this.previousPrompt);
                    Study.this.toggleAudioButton();
                    Study.this.loadPrompt();
                });
            } else {
                Study.prompt.next();
            }
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            Study.prompt.data().vocab.play();
            event.preventDefault();
        },
        previousPrompt: function() {
            if (Study.prompt)
                if (Study.history.length > 0) {
                    console.log('historic prompts exist');
                    /*Study.prompt = Study.history[0];
                    Study.this.loadPrompt();*/
                } else {
                    console.log('no historic prompt');
                }
        },
        /**
         * @method toggleAudioButton
         */
        toggleAudioButton: function() {
            if (Study.prompt.data().vocab.has('audio')) {
                this.$('#audio-button span').removeClass('fa fa-volume-off');
                this.$('#audio-button span').addClass('fa fa-volume-up');
            } else {
                this.$('#audio-button span').removeClass('fa fa-volume-up');
                this.$('#audio-button span').addClass('fa fa-volume-off');
            }
        },
        updateDueCount: function() {
            this.$('#items-due').text(skritter.scheduler.getDueCount());
        }
    });
    
    return Study;
});
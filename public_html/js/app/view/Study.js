/**
 * @module Skritter
 * @submodule View
 * @param PromptRune
 * @param PromptTone
 * @param PromptDefn
 * @param PromptRdng
 * @param templateStudy
 * @author Joshua McFarland
 */
define([
    'prompt/PromptRune',
    'prompt/PromptTone',
    'prompt/PromptDefn',
    'prompt/PromptRdng',
    'require.text!template/study.html',
    'backbone'
], function(PromptRune, PromptTone, PromptDefn, PromptRdng, templateStudy) {
    /**
     * @class StudyView
     */
    var Study = Backbone.View.extend({
        initialize: function() {
            Study.c = {prompt: null, item: null, vocabs: null};
        },
        /**
         * @method render
         * @return {StudyView}
         */
        render: function() {
            this.$el.html(templateStudy);
            this.resize();
            this.$('#items-due').text(Skritter.study.items.getItemsDue());
            Skritter.timer.setElement(this.$('#timer')).render();
            this.next();
            
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Study #info-button': 'showInfo'
        },
        /**
         * @method handlePromptComplete
         */
        handlePromptComplete: function() {
            this.next();
        },
        /**
         * @method next
         * @returns {Object}
         */
        next: function() {
            Study.c.item = Skritter.study.items.getRandom();
            Study.c.vocabs = Study.c.item.getVocabs();
            switch (Study.c.item.get('part')) {
                case 'rune':
                    Study.c.prompt = new PromptRune();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'tone':
                    Study.c.prompt = new PromptTone();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'defn':
                    Study.c.prompt = new PromptDefn();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
                case 'rdng':
                    Study.c.prompt = new PromptRdng();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
            }
            
            Study.c.prompt.set(Study.c.item, Study.c.vocabs).showHidden();
            this.listenToOnce(Study.c.prompt, 'complete', this.handlePromptComplete);
            return Study.c;
        },
        /**
         * @method showInfo
         */ 
        showInfo: function() {
            document.location.hash = 'info/' + Study.c.vocabs[0].get('id');
        },
        /**
         * @method resize
         */
        resize: function() {
            //todo
        }
    });


    return Study;
});
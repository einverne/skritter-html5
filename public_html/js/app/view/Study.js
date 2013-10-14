/**
 * @module Skritter
 * @submodule View
 * @param PromptRune
 * @param templateStudy
 * @author Joshua McFarland
 */
define([
    'prompt/PromptRune',
    'require.text!template/study.html',
    'backbone'
], function(PromptRune, templateStudy) {
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
        
        events: {
            'click.Study #info-button': 'showInfo'
        },
        
        handlePromptComplete: function() {
            this.next();
        },
        
        next: function() {
            Study.c.item = Skritter.study.items.getRandom();
            Study.c.vocabs = Study.c.item.getVocabs();
            switch (Study.c.item.get('part')) {
                case 'rune':
                    Study.c.prompt = new PromptRune();
                    Study.c.prompt.setElement(this.$('#prompt-container')).render();
                    break;
            }
            Study.c.prompt.set(Study.c.item, Study.c.vocabs).showHidden();
            this.listenToOnce(Study.c.prompt, 'complete', this.handlePromptComplete);
        },
           
        showInfo: function() {
            document.location.hash = 'info/' + Study.c.vocabs[0].get('id');
        },
        
        resize: function() {
            //todo
        }
    });


    return Study;
});
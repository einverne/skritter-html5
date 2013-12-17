/**
 * @module Skritter
 * @submodule Prompts
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'components/GradingButtons',
    'backbone'
], function(GradingButtons) {
    var Prompt = Backbone.View.extend({
        initialize: function() {
            Prompt.contained = [];
            Prompt.definition = '';
            Prompt.finished = false;
            Prompt.gradingButtons = new GradingButtons();
            Prompt.gradeColorHex = {
                1: '#e68e8e',
                2: '#d95757',
                3: '#70da70',
                4: '#4097d3'
            };
            Prompt.gradeColorFilters = {
                1: new createjs.ColorFilter(0, 0, 0, 1, 230, 142, 142, 1),
                2: new createjs.ColorFilter(0, 0, 0, 1, 217, 87, 87, 1),
                3: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1),
                4: new createjs.ColorFilter(0, 0, 0, 1, 112, 218, 112, 1)
            };
            Prompt.item = null;
            Prompt.position = 1;
            Prompt.reading = '';
            Prompt.results = [];
            Prompt.sentence = '';
            Prompt.vocabs = null;
            Prompt.writing = '';
            this.listenTo(skritter.settings, 'resize', this.resize);
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradeSelected);
        },
        render: function() {
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            this.$('.prompt-writing').addClass(skritter.user.getTextStyle());
            this.$('.prompt-sentence').addClass(skritter.user.getTextStyle());
            this.resize();
        },
        handleGradeSelected: function(selected) {
            Prompt.grade = selected;
            if (Prompt.finished) {
                this.next();
            }
        },
        /**
         * @method isFinished
         * @returns {Boolean}
         */
        isFinished: function() {
            if (Prompt.finished)
                return true;
            return false;
        },
        /**
         * Returns true if the prompt is in the first position.
         * 
         * @method isFirst
         * @returns {Boolean}
         */
        isFirst: function() {
            if (Prompt.position === 1)
                return true;
            return false;
        },
        /**
         * Returns true if the prompt is in the last position.
         * 
         * @method isLast
         * @returns {Boolean}
         */
        isLast: function() {
            if (Prompt.position >= Prompt.vocabs[0].getCharacterCount())
                return true;
            return false;
        },
        /**
         * @method next
         */
        next: function() {
            //store the results for the item or subitem
            Prompt.results.push({
                item: Prompt.contained[Prompt.position - 1],
                grade: Prompt.gradingButtons.grade(),
                reviewTime: skritter.timer.getReviewTime(),
                startTime: skritter.timer.getStartTime(),
                thinkingTime: skritter.timer.getThinkingTime()
            });
            //defn and rdng prompts don't have subitems
            this.triggerPromptComplete();
        },
        /**
         * @method resize
         */
        resize: function() {
            var canvasSize = skritter.settings.get('canvasSize');
            this.$('#input-container').width(canvasSize);
            this.$('#input-container').height(canvasSize);
            //manually resizes the info section to fill the space mobile devices
            if (skritter.settings.get('appWidth') <= 768) {
                this.$('#info-container').height(skritter.settings.get('appHeight') - $('.navbar').height() - canvasSize - 8);
            } else {
                this.$('#info-container').height('');
            }
        },
        /**
         * @method set
         * @param {Array} vocabs
         * @param {Backbone.Model} item
         * @returns {Backbone.View}
         */
        set: function(vocabs, item) {
            console.log('PROMPT', vocabs[0].get('writing'), item, vocabs);
            Prompt.contained = item.getContained();
            Prompt.definition = vocabs[0].get('definitions')[skritter.user.getSetting('sourceLang')];
            Prompt.item = item;
            Prompt.reading = vocabs[0].get('reading');
            Prompt.sentence = vocabs[0].getSentence();
            Prompt.vocabs = vocabs;
            Prompt.writing = vocabs[0].get('writing');
            skritter.timer.reset();
            return this;
        },
        /**
         * @method triggerPromptComplete
         */
        triggerPromptComplete: function() {
            this.trigger('complete', Prompt.results);
        }
    });

    return Prompt;
});
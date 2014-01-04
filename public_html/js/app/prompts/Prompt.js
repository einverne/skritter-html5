/**
 * @module Skritter
 * @submodule Prompts
 * @param PinyinConverter
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'components/GradingButtons',
    'backbone'
], function(PinyinConverter, GradingButtons) {
    /**
     * @class Prompt
     */
    var Prompt = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.contained = [];
            Prompt.count = 0;
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
            Prompt.mnemonic = null;
            Prompt.part = null;
            Prompt.position = 1;
            Prompt.reading = '';
            Prompt.results = [];
            Prompt.sentence = '';
            Prompt.vocabs = null;
            Prompt.writing = '';
            this.listenTo(skritter.settings, 'resize', this.resize);
            this.listenTo(Prompt.gradingButtons, 'selected', this.handleGradeSelected);
        },
        /**
         * @method render
         */
        render: function() {
            Prompt.gradingButtons.setElement(this.$('#grading-container')).render();
            this.$('.prompt-writing').addClass(skritter.user.getTextStyle());
            this.$('.prompt-sentence').addClass(skritter.user.getTextStyle());
            this.resize();
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Prompt #info-container .hidden-reading': 'handleHiddenReadingClicked'
        },
        /**
         * @method handleGradeSelected
         * @param {Number} selected
         */
        handleGradeSelected: function(selected) {
            Prompt.grade = selected;
            if (Prompt.finished) {
                this.next();
            }
        },
        /**
         * @method handleHiddenReadingClicked
         */
        handleHiddenReadingClicked: function() {
            if (Prompt.part === 'rune') {
                this.$('.prompt-reading').removeClass('hidden-reading');
                this.$('.prompt-reading').text(PinyinConverter.toTone(Prompt.reading));
            } else if (Prompt.part === 'tone') {
                this.$('.prompt-reading').removeClass('hidden-reading');
                this.$('.prompt-reading').html(Prompt.vocabs[0].getReadingDisplayAt(Prompt.count));
            }
        },
        /**
         * @method hideReading
         */
        hideReading: function() {
            this.$('.prompt-reading').addClass('hidden-reading');
            this.$('.prompt-reading').html("<button class='btn btn-default btn-xs hidden-reading'>show</button>");
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
            //manually resizes the info section to fill vertical mobile devices
            if (skritter.settings.get('appWidth') <= 601 && skritter.settings.get('orientation') === 'vertical') {
                this.$('#info-container').height(skritter.settings.get('appHeight') - $('.navbar').height() - canvasSize - 8);
                this.$('#info-container').width('');
            } else {
                //manually resizes the info section to fill horizontal mobile devices
                if (skritter.settings.get('appHeight') <= 601 && skritter.settings.get('appWidth') > 601) {
                    this.$('#info-container').height(canvasSize);
                    this.$('#info-container').width(skritter.settings.get('appWidth') - canvasSize - 32);
                } else {
                    this.$('#info-container').height('');
                }
            }
            //ISSUE #114: redraws the canvas on save and orientation changes
            if (Prompt.part === 'rune' || Prompt.part === 'tone')
                this.redraw();
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
            Prompt.count = vocabs[0].getCharacterCount();
            Prompt.definition = vocabs[0].getDefinition();
            Prompt.item = item;
            Prompt.mnemonic = vocabs[0].get('mnemonic');
            Prompt.part = item.get('part');
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

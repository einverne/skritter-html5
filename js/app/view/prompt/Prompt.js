/**
 * @module Skritter
 * @submobule Prompt
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'prompt/GradingButtons',
    'backbone'
], function(GradingButtons) {
    /**
     * @class Prompt
     */
    var Prompt = Backbone.View.extend({
        initialize: function() {
            Prompt.buttons = new GradingButtons();
            Prompt.finished = false;
            Prompt.grade = 3;
            Prompt.gradeColors = {
                1: '#e68e8e',
                2: '#d95757',
                3: '#70da70',
                4: '#4097d3'
            };
            Prompt.gradeColorFilters = {
                1: new createjs.ColorFilter(0,0,0,1, 230,142,142,1),
                2: new createjs.ColorFilter(0,0,0,1, 217,87,87,1),
                3: new createjs.ColorFilter(0,0,0,1, 112,218,112,1),
                4: new createjs.ColorFilter(0,0,0,1, 112,218,112,1)
            };
            Prompt.position = 1;
            Prompt.results = [];
            Prompt.vocabs = null;
            this.listenTo(Skritter.settings, 'resize', this.resize);
        },
        pushResult: function(grade, reviewTime, startTime, thinkingTime) {
            Prompt.results.push({
                grade: grade,
                reviewTime: reviewTime,
                startTime: startTime,
                thinkingTime: thinkingTime
            });
        },
        set: function(vocabs) {
            console.log('Prompt', vocabs[0].get('writing'));
            Prompt.definition = vocabs[0].get('definitions')[Skritter.user.get('settings').sourceLang];
            Prompt.reading = vocabs[0].get('reading');
            Prompt.sentence = (vocabs[0].getSentence()) ? vocabs[0].getSentence().get('writing') : null;
            Prompt.vocabs = vocabs;
            Prompt.writing = vocabs[0].get('writing');
            return this;
        },
        resize: function() {
            var canvasSize = Skritter.settings.get('canvasSize');
            this.$('#prompt-bottom').width(canvasSize);
            this.$('#prompt-bottom').height(canvasSize);
            this.$('#canvas-container').width(canvasSize);
            this.$('#canvas-container').height(canvasSize);
        },
        showGrading: function(selected) {
            Prompt.buttons.setElement(this.$('#prompt-bottom')).render();
            if (selected)
                Prompt.buttons.select(selected);
            this.listenToOnce(Prompt.buttons, 'selected', this.handleGradeSelected);
        },
        triggerPromptComplete: function() {
            console.log('prompt complete');
            this.trigger('complete', Prompt.results);
        }
    });
    
    
    return Prompt;
});
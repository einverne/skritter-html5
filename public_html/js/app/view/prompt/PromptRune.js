/**
 * @module Skritter
 * @submodule Prompt
 * @param PinyinConverter
 * @param Recognizer
 * @param CanvasCharacter
 * @param CanvasStroke
 * @param GradingButtons
 * @param Canvas
 * @param templateRune
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'Recognizer',
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'prompt/GradingButtons',
    'prompt/PromptCanvas',
    'require.text!template/prompt-rune.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Recognizer, CanvasCharacter, CanvasStroke, GradingButtons, Canvas, templateRune) {
    /**
     * @class PromptRune
     */
    var Rune = Backbone.View.extend({
        initialize: function() {
            Skritter.timer.setReviewLimit(30000);
            Skritter.timer.setThinkingLimit(15000);
            Rune.buttons = null;
            Rune.canvas = new Canvas();
            Rune.item = null;
            Rune.failedAttempts = 0;
            Rune.finished = false;
            Rune.grade = 3;
            Rune.gradeColors = {
                1: '#e68e8e',
                2: '#d95757',
                3: '#70da70',
                4: '#4097d3'
            };
            Rune.maxFailedAttempts = 3;
            Rune.minStrokeDistance = 25;
            Rune.position = 1;
            Rune.results = [];
            Rune.userCharacter = null;
            Rune.userTargets = [];
            Rune.vocabs = null;
            this.listenTo(Rune.canvas, 'mouseup', this.handleInputRecieved);
        },
        /**
         * @method render
         * @returns {PromptRune}
         */
        render: function() {
            this.$el.html(templateRune);
            Rune.canvas.setElement(this.$('#canvas-container')).render();
            this.$('#prompt-canvas').hammer().on('doubletap.Rune', this.handleDoubleTap);
            this.$('#prompt-canvas').hammer().on('hold.Rune', _.bind(this.handleHold, this));
            this.$('#prompt-canvas').hammer().on('swipeleft.Rune', _.bind(this.handleSwipeLeft, this));
            return this;
        },
        /**
         * @method clear
         */
        clear: function() {
            Rune.buttons.remove();
            Rune.canvas.clear();
            Rune.userCharacter = new CanvasCharacter();
        },
        /**
         * @method handleInputRecieved
         * @param {Array} points
         */
        handleInputRecieved: function(points) {
            //check to see if the input recieved points
            if (points.length === 0)
                return;
            //check that a minimum distance is met
            if (Skritter.fn.getDistance(points[0], points[points.length - 1]) > Rune.minStrokeDistance) {
                //fade any hints that were previously visible
                Rune.canvas.fadeOverlay();
                //create the stroke from the points to analyze
                var stroke = new CanvasStroke().set('points', points);
                //recognize a stroke based on user input and targets
                var result = new Recognizer(Rune.userCharacter, stroke, Rune.userTargets).recognize();
                //check if a result exists and that it's not a duplicate
                if (result && !Rune.userCharacter.containsStroke(result)) {
                    //reset the failed attempts counter
                    Rune.failedAttempts = 0;
                    //add the stroke to the users character
                    Rune.userCharacter.add(result);
                    //choose whether to draw the stroke normally or using raw squigs
                    if (Skritter.user.get('settings').squigs) {
                        Rune.canvas.drawSquig(result);
                        this.handleStrokeComplete();
                    } else {
                        Rune.canvas.drawStroke(result, _.bind(this.handleStrokeComplete, this));
                    }
                } else {
                    Rune.failedAttempts++;
                    //if failed too many times show a hint
                    if (Rune.failedAttempts > Rune.maxFailedAttempts) {
                        console.log('hinting');
                        Rune.grade = 1;
                        Rune.canvas.drawPhantomStroke(this.getNextStroke());
                    }
                }
            }
        },
        handleCharacterComplete: function() {
            Rune.finished = true;
            this.showAnswer();
            //checks if we should snap or just glow the result
            if (Skritter.user.get('settings').squigs) {
                for (var i in Rune.userCharacter.models)
                {
                    var stroke = Rune.userCharacter.models[i];
                    Rune.canvas.drawStroke(stroke);
                }
                Rune.canvas.glowCharacter(Rune.userTargets[0], Rune.gradeColors[Rune.grade]);
            } else {
                Rune.canvas.glowCharacter(Rune.userTargets[0], Rune.gradeColors[Rune.grade]);
            }
            //show the grading buttons and listen for a selection
            this.showGrading();
        },
        handleDoubleTap: function() {
            if (!Rune.finished) {
                Rune.canvas.drawCharacter(Rune.userTargets[0], 0.3);
                Rune.grade = 1;
            }
        },
        handleGradeSelected: function(selected) {
            Rune.grade = selected;
            Rune.buttons.remove();
            this.next();
        },
        handleHold: function() {
            this.clear();
            Rune.canvas.enableInput();
        },
        handleStrokeComplete: function() {
            //check if the character has been completed yet or not
            if (Rune.userCharacter.getStrokeCount() > this.getTargetStrokeCount())
                this.handleCharacterComplete();
        },
        handleSwipeLeft: function() {
            if (Rune.finished)
                this.next();
        },
        getNextStroke: function() {
            //todo: make this handle strokes with alternatives
            //right now it's just using the first target
            var target = Rune.userTargets[0];
            var stroke = target.at(Rune.userCharacter.length);
            return stroke;
        },
        getTargetStrokeCount: function() {
            var strokeCount = 0;
            for (var a in Rune.userTargets)
            {
                if (Rune.userTargets[a].getStrokeCount() > strokeCount) {
                    strokeCount = Rune.userTargets[a].getStrokeCount();
                }
            }
            return strokeCount - 1;
        },
        next: function() {
            console.log('next', Rune.position, Rune.vocabs[0].getCharacterCount());
            Rune.position++;
            //check to see if there are more characters in the prompt
            if (Rune.position <= Rune.vocabs[0].getCharacterCount()) {
                Rune.finished = false;
                //clear the canvas for the new character
                this.clear();
                //resets the targets
                Rune.userTargets = [];
                //set the new targets based on the position
                Rune.userTargets = Rune.vocabs[0].getCanvasCharacters(Rune.position - 1, 'rune');
                this.showHidden();
                //enable the canvas to begin next prompt
                Rune.canvas.enableInput();
            } else {
                this.triggerPromptComplete();
            }
        },
        resize: function() {
            //todo: add this in to fit prompt exactly to screen
        },
        set: function(item, vocabs) {
            console.log('Prompt', 'RUNE', vocabs[0].get('writing'));
            Rune.definition = vocabs[0].get('definitions')[Skritter.user.get('settings').sourceLang];
            Rune.item = item;
            Rune.reading = vocabs[0].get('reading');
            Rune.sentence = (vocabs[0].getSentence()) ? vocabs[0].getSentence().get('writing') : null;
            Rune.vocabs = vocabs;
            Rune.userCharacter = new CanvasCharacter();
            Rune.userTargets = vocabs[0].getCanvasCharacters(Rune.position - 1, 'rune');
            Rune.writing = vocabs[0].get('writing');
            return this;
        },
        showAnswer: function() {
            Skritter.timer.stop();
            Rune.canvas.disableInput();
            this.$('#writing').html(Rune.vocabs[0].getWritingDisplayAt(Rune.position));
        },
        showGrading: function() {
            Rune.buttons = new GradingButtons();
            Rune.buttons.setElement(this.$('#canvas-container')).render();
            this.listenToOnce(Rune.buttons, 'selected', this.handleGradeSelected);
        },
        showHidden: function() {
            Skritter.timer.start();
            Rune.canvas.enableInput();
            this.$('#writing').html(Rune.vocabs[0].getWritingDisplayAt(Rune.position - 1));
            this.$('#reading').text(PinyinConverter.toTone(Rune.reading));
            this.$('#definition').text(Rune.definition);
            this.$('#sentence').text(Skritter.fn.maskCharacters(Rune.sentence, Rune.writing, ' _ '));
        },
        triggerPromptComplete: function() {
            console.log('prompt complete');
            this.trigger('complete');
        }
    });


    return Rune;
});
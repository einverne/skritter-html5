/**
 * @module Skritter
 * @submodule Prompt
 * @param PinyinConverter
 * @param Recognizer
 * @param CanvasCharacter
 * @param CanvasStroke
 * @param Prompt
 * @param Canvas
 * @param templateRune
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'Recognizer',
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'prompt/Prompt',
    'prompt/PromptCanvas',
    'require.text!template/prompt-rune.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Recognizer, CanvasCharacter, CanvasStroke, Prompt, Canvas, templateRune) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Skritter.timer.setReviewLimit(30000);
            Skritter.timer.setThinkingLimit(15000);
            Rune.canvas = new Canvas();
            Rune.failedAttempts = 0;
            Rune.maxFailedAttempts = 3;
            Rune.minStrokeDistance = 25;
            Rune.strokeCount = 0;
            Rune.userCharacter = null;
            Rune.userTargets = [];
            this.listenTo(Rune.canvas, 'mouseup', this.handleInputRecieved);
        },
        /**
         * @method render
         * @returns {PromptRune}
         */
        render: function() {
            this.$el.html(templateRune);
            Rune.canvas.setElement(this.$('#canvas-container')).render();
            this.$('#prompt-canvas').hammer().on('doubletap.Rune', _.bind(this.handleDoubleTap, this));
            this.$('#prompt-canvas').hammer().on('hold.Rune', _.bind(this.handleHold, this));
            this.$('#prompt-canvas').hammer().on('swipeleft.Rune', _.bind(this.handleIfFinished, this));
            this.$('#prompt-canvas').hammer().on('tap.Rune', _.bind(this.handleIfFinished, this));
            return this;
        },
        /**
         * @method clear
         */
        clear: function() {
            Prompt.buttons.remove();
            Rune.canvas.clear('background');
            Rune.canvas.clear('hint');
            Rune.canvas.clear('stroke');
            Prompt.finished = false;
            Rune.userCharacter = new CanvasCharacter();
        },
        /**
         * Handles the points returned when the user is finished with a stroke.
         * 
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
                Rune.canvas.fadeLayer('background');
                //create the stroke from the points to analyze
                var stroke = new CanvasStroke().set('points', points);
                //recognize a stroke based on user input and targets
                var result = new Recognizer(Rune.userCharacter, stroke, Rune.userTargets).recognize();
                //check if a result exists and that it's not a duplicate
                if (result && !Rune.userCharacter.containsStroke(result)) {
                    //add the stroke to the users character
                    Rune.userCharacter.add(stroke);
                    //reset the failed attempts counter
                    Rune.failedAttempts = 0;
                    //choose whether to draw the stroke normally or using raw squigs
                    if (Skritter.user.get('settings').squigs) {
                        Rune.canvas.drawSquig(result.get('points'), 'overlay');
                        this.handleStrokeComplete(result);
                    } else {
                        //display feedback if it exists
                        if (result.get('feedback')) {
                            Rune.canvas.drawText(result.get('feedback'), 'feedback', 'orange', '24px Arial', 10, 10);
                        }
                        //properly tracking when a character is complete requires better tween handling
                        result.set('isTweening', true);
                        Rune.canvas.drawTweenedStroke(result.getUserSprite(), result.getInflatedSprite(), 'stroke', _.bind(this.handleStrokeComplete, this, result));
                    }
                } else {
                    Rune.failedAttempts++;
                    //if failed too many times show a hint
                    if (Rune.failedAttempts > Rune.maxFailedAttempts) {
                        Prompt.grade = 1;
                        Rune.canvas.drawPhantomStroke(this.getNextStroke().stroke.getInflatedSprite(), 'hint');
                    }
                }
            }
        },
        /**
         * Handles the character if it is complete by applying the correct background glow
         * and then displaying the grading buttons.
         * 
         * @method handleCharacterComplete
         */
        handleCharacterComplete: function() {
            console.log('character complete');
            //catches callbacks firing at the same time with people writing quickly
            //otherwise it's possible a character can complete twice
            if (Prompt.finished === true)
                return;
            Prompt.finished = true;
            this.showAnswer();
            //checks if we should snap or just glow the result
            if (Skritter.user.get('settings').squigs) {
                for (var i in Rune.userCharacter.models)
                {
                    var stroke = Rune.userCharacter.models[i];
                    Rune.canvas.drawTweenedStroke(stroke.getUserSprite(), stroke.getInflatedSprite(), 'stroke', function() {
                        Rune.canvas.filterLayerColor('stroke', Prompt.gradeColorFilters[Prompt.grade]);
                    });
                    Rune.canvas.setLayerAlpha('overlay', 0.5);
                }
            } else {
                Rune.canvas.filterLayerColor('stroke', Prompt.gradeColorFilters[Prompt.grade]);
            }
            //show the grading buttons and listen for a selection
            this.showGrading(Prompt.grade);
        },
        /**
         * Handles the double tap event by displaying the character hint if it's
         * not finished yet.
         * 
         * @method handleDoubleTap
         */
        handleDoubleTap: function() {
            if (!Prompt.finished) {
                Rune.canvas.drawCharacter(Rune.userTargets[this.getNextStroke().variation].getCharacterSprite(), 'background', 0.3);
                Prompt.grade = 1;
            }
        },
        /**
         * Handles either the swipeleft or tap events by moving to the next if the
         * prompt has already been finished.
         * 
         * @method handleIfFinished
         */
        handleIfFinished: function() {
            if (Prompt.finished) {
                Prompt.buttons.remove();
                this.next();
            }
        },
        /**
         * Handles the grade selected event by passing the selected grade along and then
         * called the next character in the prompt.
         * 
         * @method handleGradeSelected
         * @param {Number} selected
         */
        handleGradeSelected: function(selected) {
            Prompt.grade = selected;
            Prompt.buttons.remove();
            this.next();
        },
        /**
         * Handles the hold event by clearing the canvas and reseting the input.
         * 
         * @method handleHold
         */
        handleHold: function() {
            this.clear();
            Rune.canvas.enableInput();
        },
        /**
         * Handles a complete stroke a trigger by the PromptCanvas. It also checks to see
         * if the character has been completed yet or not.
         * 
         * @method handleStrokeComplete
         * @param {CanvasStroke} stroke
         */
        handleStrokeComplete: function(stroke) {
            //flag the stroke as not being tweened once it finishes
            stroke.set('isTweening', false);
            //check if the character has been completed yet or not with enforced tween checks
            if (Rune.userCharacter.getStrokeCount(true) >= this.getTargetStrokeCount()) {
                this.handleCharacterComplete();
            }
        },
        /**
         * Returns the next stroke in the character based on the order it should be written. It also
         * return the variation, so the matching background hint can be displayed.
         * 
         * @method getNextStroke
         * @returns {CanvasStroke}
         */
        getNextStroke: function() {
            //ISSUE #26: needs to properly get the position and check for contained strokes
            var position = Rune.userCharacter.getStrokeCount() + 1;
            for (var a in Rune.userTargets) {
                var stroke = Rune.userTargets[a].findWhere({position: position});
                if (stroke && !Rune.userCharacter.containsStroke(stroke))
                        return {variation: a, stroke: stroke};
            }
        },
        /**
         * Returns the stroke highest possible stroke count out of all of the targets.
         * 
         * @method getTargetStrokeCount
         * @returns {Number}
         */
        getTargetStrokeCount: function() {
            var strokeCount = 0;
            for (var a in Rune.userTargets)
            {
                if (Rune.userTargets[a].getStrokeCount() > strokeCount) {
                    strokeCount = Rune.userTargets[a].getStrokeCount();
                }
            }
            return strokeCount;
        },
        /**
         * Moves to the next item in the prompt for prompts containing multiple characters.
         * 
         * @method next
         */
        next: function() {
            console.log('next', Prompt.position, Prompt.vocabs[0].getCharacterCount());
            Prompt.position++;
            //ISSUE #27: skips kana characters in the vocabs writing string
            if (Skritter.user.isJapanese() && Skritter.fn.isKana(Prompt.vocabs[0].getCharacterAt(Prompt.position - 1))) {
                this.next();
                return;
            }
            //makes sure the result contains something useful otherwise discard it
            if (Skritter.timer.getStartTime() !== 0)
                this.pushResult(Prompt.grade, Skritter.timer.getReviewTime(), Skritter.timer.getStartTime(), Skritter.timer.getThinkingTime());
            //check to see if there are more characters in the prompt
            if (Prompt.position <= Prompt.vocabs[0].getCharacterCount()) {
                //reset the item for a new character
                Rune.failedAttempts = 0;
                Prompt.grade = 3;
                Prompt.finished = false;
                //clear the canvas for the new character
                this.clear();
                Rune.canvas.setLayerAlpha('input', 1);
                //resets the targets
                Rune.userTargets = [];
                //lets go ahead and show the net character in the item
                this.show();
                //enable the canvas to begin next prompt
                Rune.canvas.enableInput();
            } else {
                this.triggerPromptComplete();
            }
        },
        /**
         * Displays the initial prompt for the user and should probably be renamed to
         * something a little less misleading than show hidden.
         * 
         * @method show
         */
        show: function() {
            //ISSUE #30: skips japanese characters with leading kana
            if (Skritter.user.isJapanese() && Skritter.fn.isKana(Prompt.vocabs[0].getCharacterAt(Prompt.position-1))) {
                this.next();
                return;
            }
            console.log('Prompt', 'RUNE', Prompt.vocabs[0].get('writing'));
            Skritter.timer.start();
            //play the audio file if the first character
            if (Prompt.vocabs[0].has('audio') && Prompt.position === 1 && Skritter.user.get('audio'))
                Prompt.vocabs[0].play();
            Rune.userCharacter = new CanvasCharacter();
            Rune.userTargets = Prompt.vocabs[0].getCanvasCharacters(Prompt.position - 1, 'rune');
            Rune.canvas.enableInput();
            this.$('#writing').html(Prompt.vocabs[0].getWritingDisplayAt(Prompt.position - 1));
            this.$('#reading').text(PinyinConverter.toTone(Prompt.reading));
            this.$('#definition').text(Prompt.definition);
            this.$('#style').text(Prompt.vocabs[0].get('style'));
            if (Prompt.sentence)
                this.$('#sentence').text(Skritter.fn.maskCharacters(Prompt.sentence, Prompt.writing, ' _ '));
        },
        /**
         * Displays the answer for the user, which should be called after the prompt
         * has been completed.
         * 
         * @method showAnswer
         */
        showAnswer: function() {
            Skritter.timer.stop();
            Rune.canvas.disableInput();
            this.$('#writing').html(Prompt.vocabs[0].getWritingDisplayAt(Prompt.position));
            if (Prompt.sentence && Prompt.position >= Prompt.vocabs[0].getCharacterCount())
                this.$('#sentence').text(Skritter.fn.maskCharacters(Prompt.sentence));
        },
        /**
         * Displays the recognition parameters as points on the canvas which can be
         * useful for debugging recognition problems and quircks.
         * 
         * @method showParams
         */
        showParams: function() {
            for (var i in Rune.userTargets[0].models) {
                var stroke = Rune.userTargets[0].at(i);
                Rune.canvas.drawParam(stroke.getInflatedParams()[0], 'overlay');
            }
        }
    });


    return Rune;
});

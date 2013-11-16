/**
 * @module Skritter
 * @submodule Prompt
 * @param PinyinConverter
 * @param Recognizer
 * @param CanvasCharacter
 * @param CanvasStroke
 * @param Prompt
 * @param Canvas
 * @param templateTone
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'Recognizer',
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'prompt/Prompt',
    'prompt/PromptCanvas',
    'require.text!template/prompt-tone.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Recognizer, CanvasCharacter, CanvasStroke, Prompt, Canvas, templateTone) {
    /**
     * @class PromptTone
     */
    var Tone = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            Skritter.timer.setReviewLimit(15000);
            Skritter.timer.setThinkingLimit(10000);
            Tone.buttons = null;
            Tone.canvas = new Canvas();
            Tone.minStrokeDistance = 25;
            Tone.userCharacter = null;
            Tone.userTargets = [];
            this.listenTo(Tone.canvas, 'mouseup', this.handleInputRecieved);
        },
        /**
         * @method render
         * @returns {PromptTone}
         */
        render: function() {
            this.$el.html(templateTone);
            Tone.canvas.disableGrid();
            Tone.canvas.setElement(this.$('#canvas-container')).render();
            this.$('#prompt-canvas').hammer().on('doubletap.Tone', _.bind(this.handleDoubleTap, this));
            this.$('#prompt-canvas').hammer().on('hold.Tone', _.bind(this.handleHold, this));
            this.resize();
            return this;
        },
        /**
         * @method clear
         */
        clear: function() {
            Prompt.buttons.remove();
            Tone.canvas.clear();
            Tone.userCharacter = new CanvasCharacter();
        },
        /**
         * @method getTargetStrokeCount
         */
        getTargetStrokeCount: function() {
            var strokeCount = 0;
            for (var a in Tone.userTargets)
            {
                if (Tone.userTargets[a].getStrokeCount() > strokeCount) {
                    strokeCount = Tone.userTargets[a].getStrokeCount();
                }
            }
            return strokeCount - 1;
        },
        /**
         * @method handleCharacterComplete
         */
        handleCharacterComplete: function() {
            Prompt.finished = true;
            this.showAnswer();
            //if multiple possible tone answers then display the one drawn
            Tone.canvas.filterLayerColor('stroke', Prompt.gradeColorFilters[Prompt.grade]);
            //show the grading buttons and listen for a selection
            this.showGrading(Prompt.grade);
        },
        /**
         * @method handleDoubleTap
         */
        handleDoubleTap: function() {
            
        },
        /**
         * @method handleGradeSelected
         * @param {String} selected
         */
        handleGradeSelected: function(selected) {
            Prompt.grade = selected;
            Prompt.buttons.remove();
            this.next();
        },
        /**
         * @method handleHold
         */
        handleHold: function() {
            Prompt.buttons.remove();
            Tone.canvas.clear('stroke');
            Tone.userCharacter = new CanvasCharacter();
            Tone.canvas.enableInput();
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
         * @method handleInputRecieved
         * @param {Array} points
         */
        handleInputRecieved: function(points) {
            //check to see if the input recieved points
            if (points.length === 0)
                return;
            //check that a minimum distance is met
            if (Skritter.fn.getDistance(points[0], points[points.length - 1]) > Tone.minStrokeDistance) {
                //create the stroke from the points to analyze
                var stroke = new CanvasStroke().set('points', points);
                //recognize a stroke based on user input and targets
                var result = new Recognizer(Tone.userCharacter, stroke, Tone.userTargets).recognize();
                //check if a result exists and that it's not a duplicate
                if (result && !Tone.userCharacter.containsStroke(result)) {
                    //add the stroke to the users character
                    Tone.userCharacter.add(result);
                    Tone.canvas.drawStroke(result.getInflatedSprite(), 'stroke');
                } else {
                    Prompt.grade = 1;
                    //select the first possible tone and display it as wrong
                    Tone.userCharacter.add(Tone.userTargets[0].at(0));
                    Tone.canvas.drawStroke(Tone.userTargets[0].at(0).getInflatedSprite(), 'stroke');
                }
                this.handleStrokeComplete();
            }
        },
        /**
         * @method handleStrokeComplete
         */
        handleStrokeComplete: function() {
            //check if the character has been completed yet or not
            if (Tone.userCharacter.getStrokeCount() > this.getTargetStrokeCount())
                this.handleCharacterComplete();
        },
        /**
         * @method next
         */
        next: function() {
            this.pushResult(Prompt.grade, Skritter.timer.getReviewTime(), Skritter.timer.getStartTime(), Skritter.timer.getThinkingTime());
            Prompt.position++;
            //check to see if there are more characters in the prompt
            if (Prompt.position <= Prompt.vocabs[0].getCharacterCount()) {
                //reset the item for a new character
                Prompt.grade = 3;
                Prompt.finished = false;
                //clear the canvas for the new character
                this.clear();
                //resets the targets
                Tone.userTargets = [];
                //go ahead and show the next part of the prompt
                this.show();
                //enable the canvas to begin next prompt
                Tone.canvas.enableInput();
            } else {
                this.triggerPromptComplete();
            }
        },
        /**
         * @method show
         */
        show: function() {
            Skritter.timer.start();
            Tone.userCharacter = new CanvasCharacter();
            Tone.userTargets = Prompt.vocabs[0].getCanvasCharacters(Prompt.position - 1, 'tone');
            Tone.canvas.drawCharacterFromFont(Prompt.vocabs[0].getCharacterAt(Prompt.position - 1), 'background', 0.3);
            Tone.canvas.enableInput();
            this.$('#writing').html(Prompt.writing);
            this.$('#reading').html(PinyinConverter.toTone(Prompt.vocabs[0].getReadingDisplayAt(Prompt.position - 1)));
            this.$('#definition').text(Prompt.definition);
            this.$('#style').text(Prompt.vocabs[0].get('style'));
            if (Prompt.sentence)
                this.$('#sentence').text(Prompt.sentence);
        },
        /**
         * @method showAnswer
         */
        showAnswer: function() {
            Skritter.timer.stop();
            Tone.canvas.disableInput();
            this.$('#reading').html(PinyinConverter.toTone(Prompt.vocabs[0].getReadingDisplayAt(Prompt.position)));
            //play the audio file if last prompt is finished
            if (Prompt.vocabs[0].has('audio') && Prompt.position === Prompt.vocabs[0].getCharacterCount() && Skritter.user.get('audio'))
                Prompt.vocabs[0].play();
            //events
            this.$('#prompt-canvas').hammer().one('swipeleft.Tone', _.bind(this.handleIfFinished, this));
            this.$('#prompt-canvas').hammer().one('tap.Tone', _.bind(this.handleIfFinished, this));
        }
    });
    
    
    return Tone;
});
/**
 * @module Skritter
 * @submodule Prompts
 * @param PinyinConverter
 * @param Recognizer
 * @param CanvasCharacter
 * @param CanvasStroke
 * @param Canvas
 * @param Prompt
 * @param templateTone
 * @author Joshua McFarland
 */
define([
    'Recognizer',
    'collections/CanvasCharacter',
    'models/CanvasStroke',
    'prompts/Canvas',
    'prompts/Prompt',
    'require.text!templates/prompts-tone.html',
    'backbone',
    'jquery.hammer'
], function(Recognizer, CanvasCharacter, CanvasStroke, Canvas, Prompt, templateTone) {
    /**
     * @class PromptTone
     */
    var Tone = Prompt.extend({
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(15);
            skritter.timer.setThinkingLimit(10);
            Tone.canvas = new Canvas();
            Tone.minStrokeDistance = 15;
            Tone.userCharacter = null;
            this.listenTo(Tone.canvas, 'mousedown', this.handleInputDown);
            this.listenTo(Tone.canvas, 'mouseup', this.handleInputRecieved);
        },
        render: function() {
            this.$el.html(templateTone);
            Tone.canvas.setElement(this.$('#canvas-container')).render();
            this.$('#canvas-container').hammer().on('hold.Tone', _.bind(this.handleHold, this));
            this.$('#canvas-container').hammer().on('swipeleft.Tone', _.bind(this.handleSwipeLeft, this));
            this.$('#canvas-container').hammer().on('tap.Tone', _.bind(this.handleTap, this));
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method clear
         * @return {Backbone.View}
         */
        clear: function() {
            Prompt.gradingButtons.hide();
            Prompt.gradingButtons.grade(3);
            Prompt.finished = false;
            Tone.canvas.clear('hint');
            Tone.canvas.clear('overlay');
            Tone.canvas.clear('stroke');
            Tone.userCharacter.reset();
            Tone.userTargets = [];
            return this;
        },
        /**
         * @method handleCharacterComplete
         */
        handleCharacterComplete: function() {
            Prompt.finished = true;
            Tone.canvas.disableInput();
            Tone.canvas.filterLayerColor('stroke', Prompt.gradeColorFilters[Prompt.gradingButtons.grade()]);
            this.showAnswer();
        },
        /**
         * @method handleHold
         */
        handleHold: function() {
            this.clear();
            Tone.canvas.enableInput();
        },
        /**
         * @method handleInputRecieved
         * @param {Array} points
         */
        handleInputRecieved: function(points) {
            this.processInput(points, null, false);
        },
        /**
         * @method handleSwipeLeft
         */
        handleSwipeLeft: function() {
            if (Prompt.finished)
                this.next();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.finished)
                this.next();
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
            //check to see if there are more characters in the prompt
            if (this.isLast()) {
                this.triggerPromptComplete();
            } else {
                skritter.timer.reset();
                Prompt.position++;
                this.clear();
                this.show();
            }
        },
        
        /**
         * @method processInput
         * @param {Array} points
         * @param {Array} ignoreCheck
         * @param {Boolean} enforceOrder
         */
        processInput: function(points, ignoreCheck, enforceOrder) {
            if (points.length > 1) {
                //check that a minimum distance is met
                if (skritter.fn.getDistance(points[0], points[points.length - 1]) > Tone.minStrokeDistance) {
                    //create the stroke from the points to analyze
                    var stroke = new CanvasStroke().set('points', points);
                    //recognize a stroke based on user input and targets
                    var result = new Recognizer(Tone.userCharacter, stroke, Tone.userCharacter.targets).recognize(ignoreCheck, enforceOrder);
                    //check if a result exists and that it's not a duplicate
                    if (result && !Tone.userCharacter.containsStroke(result)) {
                        Prompt.gradingButtons.select(3).collapse();
                        //add the stroke to the users character
                        Tone.userCharacter.add(result);
                        //draw the stroke on the canvas without tweening
                        Tone.canvas.drawStroke(result.getInflatedSprite(), 'stroke');
                    } else {
                        Prompt.gradingButtons.select(1).collapse();
                        //select the first possible tone and display it as wrong
                        Tone.canvas.drawStroke(Tone.userCharacter.targets[0].at(0).getInflatedSprite(), 'stroke');
                    }
                }
            } else {
                //ISSUE #69: count clicks as a neutral fifth tone
                var index = _.pluck(Tone.userCharacter.targets, 'name').indexOf('tone5');
                if (index >= 0) {
                    Prompt.gradingButtons.select(3).collapse();
                    Tone.canvas.drawStroke(Tone.userCharacter.targets[index].at(0).getInflatedSprite(), 'stroke');
                } else {
                    Prompt.gradingButtons.select(1).collapse();
                    Tone.canvas.drawStroke(Tone.userCharacter.targets[0].at(0).getInflatedSprite(), 'stroke');
                }
            }
            this.handleCharacterComplete();
        },
        show: function() {
            skritter.timer.start();
            //tone prompts must display the character in the background
            Tone.canvas.clear('background');
            Tone.canvas.drawCharacterFromFont(Prompt.vocabs[0].getCharacterAt(Prompt.position - 1), skritter.user.getFontName(), 'background', 0.3);
            //displays the prompt information based on the current position
            this.$('.prompt-writing').text(Prompt.writing);
            if (skritter.user.isChinese())
                this.$('.prompt-style').text(Prompt.vocabs[0].get('style'));
            this.$('.prompt-reading').html(Prompt.vocabs[0].getReadingDisplayAt(Prompt.position - 1));
            this.$('.prompt-definition').text(Prompt.definition);
            this.$('#style').text(Prompt.vocabs[0].get('style'));
            if (Prompt.sentence)
                this.$('.prompt-sentence').text(Prompt.sentence.get('writing'));
            //ISSUE #74: redraws existing character when switching between pages
            if (Tone.userCharacter) {
                Tone.canvas.drawCharacter(Tone.userCharacter.getCharacterSprite(), 'stroke');
            } else {
                Tone.userCharacter = new CanvasCharacter();
            }
            Tone.userCharacter.targets = Prompt.vocabs[0].getCanvasCharacters(Prompt.position - 1, 'tone');
            Tone.canvas.enableInput();
        },
        showAnswer: function() {
            skritter.timer.stop();
            if (Prompt.vocabs[0].has('audio') && this.isLast() && skritter.user.get('audio'))
                Prompt.vocabs[0].play();
            this.$('.prompt-reading').html(Prompt.vocabs[0].getReadingDisplayAt(Prompt.position));
        }
    });

    return Tone;
});
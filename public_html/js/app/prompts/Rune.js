/**
 * @module Skritter
 * @submodule Prompts
 * @param PinyinConverter
 * @param Recognizer
 * @param CanvasCharacter
 * @param CanvasStroke
 * @param Canvas
 * @param Prompt
 * @param templateRune
 * @author Joshua McFarland
 */
define([
    'PinyinConverter',
    'Recognizer',
    'collections/CanvasCharacter',
    'models/CanvasStroke',
    'prompts/Canvas',
    'prompts/Prompt',
    'require.text!templates/prompts-rune.html',
    'backbone',
    'jquery.hammer'
], function(PinyinConverter, Recognizer, CanvasCharacter, CanvasStroke, Canvas, Prompt, templateRune) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Rune.canvas = new Canvas();
            Rune.failedAttempts = 0;
            Rune.maxFailedAttempts = 3;
            Rune.minStrokeDistance = 15;
            Rune.strokeCount = 0;
            Rune.teachingMode = false;
            Rune.userCharacter = null;
            this.listenTo(Rune.canvas, 'mousedown', this.handleInputDown);
            this.listenTo(Rune.canvas, 'mouseup', this.handleInputRecieved);
        },
        render: function() {
            this.$el.html(templateRune);
            Rune.canvas.enableGrid();
            Rune.canvas.setElement(this.$('#canvas-container')).render();
            this.$('#canvas-container').hammer().on('doubletap.Rune', _.bind(this.handleDoubleTap, this));
            this.$('#canvas-container').hammer().on('hold.Rune', _.bind(this.handleHold, this));
            this.$('#canvas-container').hammer().on('swipeleft.Rune', _.bind(this.handleSwipeLeft, this));
            this.$('#canvas-container').hammer().on('tap.Rune', _.bind(this.handleTap, this));
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method clear
         * @return {Backbone.View}
         */
        clear: function() {
            Prompt.gradingButtons.hide(true);
            Prompt.finished = false;
            Rune.canvas.clear('background');
            Rune.canvas.clear('hint');
            Rune.canvas.clear('overlay');
            Rune.canvas.clear('stroke');
            Rune.canvas.setLayerAlpha('overlay', 1);
            Rune.canvas.uncacheLayer('overlay');
            Rune.failedAttempts = 0;
            Rune.userCharacter.reset();
            Rune.userTargets = [];
            return this;
        },
        filterCharacter: function() {
            Rune.canvas.filterLayerColor('stroke', Prompt.gradeColorFilters[Prompt.gradingButtons.grade()]);
        },
        /**
         * @method handleCharacterComplete
         */
        handleCharacterComplete: function() {
            //stop the lap timer
            skritter.timer.stop();
            //mark the prompt as finished while the answer is shown
            Prompt.finished = true;
            //checks if we should snap or just glow the result
            if (skritter.user.getSetting('squigs')) {
                Rune.canvas.setLayerAlpha('overlay', 0.3);
                window.setTimeout(function() {
                    for (var i in Rune.userCharacter.models) {
                        var stroke = Rune.userCharacter.models[i];
                        Rune.canvas.drawTweenedStroke(stroke.getUserSprite(), stroke.getInflatedSprite(), 'stroke');
                    }
                }, 100);
            }
            this.showAnswer();
        },
        /**
         * @method handleDoubleTap
         */
        handleDoubleTap: function() {
            if (!Prompt.finished) {
                this.showTarget(0.3);
                Prompt.gradingButtons.select(1).collapse();
            }
        },
        /**
         * @method handleHold
         */
        handleHold: function() {
            this.clear();
            Rune.canvas.enableInput();
        },
        /**
         * @method handleInputDown
         */
        handleInputDown: function() {
            //ISSUE #60: thinking timer should stop when the first stroke is attempted
            skritter.timer.stopThinking();
            //fade hints when a new stroke is started
            Rune.canvas.fadeLayer('hint');
        },
        /**
         * @method handleInputRecieved
         * @param {Array} points
         * @param {CreateJS.Shape} marker
         */
        handleInputRecieved: function(points, marker) {
            this.processInput(points, marker, null, false);
        },
        /**
         * @method handleLeapRecieved
         * @param {Array} points
         */
        handleLeapRecieved: function(points) {
            this.processInput(points, null, true);
        },
        /**
         * @method handleStrokeRecognized
         * @param {Backbone.Model} result
         */
        handleStrokeRecognized: function(result) {
            //prevents multiple simultaneous from firing the character complete event
            result.set('isTweening', false);
            //check if the character has been completed yet or not with enforced tween checks
            if (Rune.userCharacter.getStrokeCount(true) >= Rune.userCharacter.getTargetStrokeCount()) {
                this.handleCharacterComplete();
            }
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
                Prompt.gradingButtons.grade(3);
                Prompt.position++;
                this.clear();
                this.show();
            }
        },
        /**
         * @method processInput
         * @param {Array} points
         * @param {CreateJS.Shape} marker
         * @param {Array} ignoreCheck
         * @param {Boolean} enforceOrder
         */
        processInput: function(points, marker, ignoreCheck, enforceOrder) {
            //only strokes of an adaquate distance should be processed
            if (points.length > 0 && skritter.fn.getDistance(points[0], points[points.length - 1]) > Rune.minStrokeDistance) {
                //create the stroke from the points to analyze
                var stroke = new CanvasStroke().set('points', points);
                //recognize a stroke based on user input and targets
                var result = new Recognizer(Rune.userCharacter, stroke, Rune.userCharacter.targets).recognize(ignoreCheck, enforceOrder);
                //check if a result exists and that it's not a duplicate
                if (result && !Rune.userCharacter.containsStroke(result)) {
                    //get the expected stroke based on accepted stroke orders
                    var expected = Rune.userCharacter.getExpectedStroke(result);
                    //add the stroke to the users character
                    Rune.userCharacter.add(stroke);
                    //reset the failed attempts counter
                    Rune.failedAttempts = 0;
                    //choose whether to draw the stroke normally or using raw squigs
                    if (skritter.user.getSetting('squigs')) {
                        Rune.canvas.drawSquig(marker, 'overlay');
                        this.handleStrokeRecognized(result);
                    } else {
                        //display feedback if it exists
                        if (result.get('feedback'))
                            Rune.canvas.showMessage(result.get('feedback').toUpperCase());
                        //mark the result as tweening and snap it
                        result.set('isTweening', true);
                        Rune.canvas.drawTweenedStroke(result.getUserSprite(), result.getInflatedSprite(), 'stroke', _.bind(this.handleStrokeRecognized, this, result));
                        //show a hint if the stroke wasn't in the expected order
                        if (expected && result.get('id') !== expected.get('id'))
                            Rune.canvas.drawPhantomStroke(Rune.userCharacter.getExpectedStroke().getInflatedSprite(), 'hint');
                    }
                    //ISSUE #63: show the grading buttons and grade color preemptively
                    if (Rune.userCharacter.getStrokeCount(false) >= Rune.userCharacter.getTargetStrokeCount())
                        Prompt.gradingButtons.select().collapse();
                    if (Rune.teachingMode)
                        this.teach();
                } else {
                    Rune.failedAttempts++;
                    //fade the shape out 
                    Rune.canvas.fadeShape('background', marker);
                    //if failed too many times show a hint
                    if (Rune.failedAttempts > Rune.maxFailedAttempts) {
                        //ISSUE #64: display grading buttons immediately when failed
                        Prompt.gradingButtons.select(1).collapse();
                        //ISSUE #28: if the find the next stroke then don't try to show a hint
                        var nextStroke = Rune.userCharacter.getNextStroke();
                        if (nextStroke)
                            Rune.canvas.drawPhantomStroke(nextStroke.getInflatedSprite('#87cefa'), 'hint');
                    }
                }
            }
        },
        /**
         * @method show
         */
        show: function() {
            skritter.timer.start();
            //displays the prompt information based on the current position
            this.$('.prompt-writing').html(Prompt.vocabs[0].getWritingDisplayAt(Prompt.position - 1));
            if (Prompt.vocabs[0].has('audio') && this.isFirst() && skritter.user.get('audio'))
                Prompt.vocabs[0].play();
            if (skritter.user.isChinese())
                this.$('.prompt-style').text(Prompt.vocabs[0].get('style'));
            if (skritter.user.getSetting('hideReading')) {
                this.hideReading();
            } else {
                this.$('.prompt-reading').text(PinyinConverter.toTone(Prompt.reading));
            }
            this.$('.prompt-definition').text(Prompt.definition);
            this.$('#style').text(Prompt.vocabs[0].get('style'));
            if (Prompt.sentence)
                this.$('.prompt-sentence').text(skritter.fn.maskCharacters(Prompt.sentence.noWhiteSpaces(), Prompt.writing, ' _ '));
            //ISSUE #74: redraws existing character when switching between pages
            if (Rune.userCharacter) {
                Rune.canvas.drawCharacter(Rune.userCharacter.getCharacterSprite(), 'stroke');
            } else {
                Rune.userCharacter = new CanvasCharacter();
            }
            Rune.userCharacter.targets = Prompt.vocabs[0].getCanvasCharacters(Prompt.position - 1, 'rune');
            if (Rune.teachingMode) {
                this.teach();
            }
            console.log('variations', Rune.userCharacter.targets);
            Rune.canvas.enableInput();
        },
        /**
         * @method showAnswer
         */
        showAnswer: function() {
            Rune.canvas.disableInput();
            Prompt.gradingButtons.select().collapse();
            this.$('.prompt-writing').html(Prompt.vocabs[0].getWritingDisplayAt(Prompt.position));
            if (skritter.user.get('audio') && Prompt.contained[Prompt.position - 1] && Prompt.contained[Prompt.position - 1].getVocabs().length > 0)
                Prompt.contained[Prompt.position - 1].getVocabs()[0].play();
            if (this.isLast()) {
                this.$('.prompt-reading').removeClass('hidden-reading');
                this.$('.prompt-reading').text(PinyinConverter.toTone(Prompt.reading));
                if (Prompt.sentence)
                    this.$('.prompt-sentence').text(Prompt.sentence.noWhiteSpaces());
            }
        },
        /**
         * @method showTarget
         * @param {Number} alpha
         */
        showTarget: function(alpha) {
            if (!Prompt.finished)
                Rune.canvas.drawCharacter(Rune.userCharacter.targets[Rune.userCharacter.getVariationIndex()].getCharacterSprite(), 'hint', alpha);
        },
        /**
         * @method teach
         */
        teach: function() {
            Rune.teachingMode = true;
            if (Rune.userCharacter.getStrokeCount() === 0)
                this.showTarget(0.5);
            var nextStroke = Rune.userCharacter.getNextStroke(true);
            Rune.canvas.clear('overlay');
            if (nextStroke) {
                Rune.canvas.drawStroke(nextStroke.getInflatedSprite('#87cefa'), 'overlay', 0.8);
            } else {
                this.clear();
                Prompt.gradingButtons.grade(1);
                Rune.teachingMode = false;
                Rune.canvas.showMessage('Now you give it a try!');
            }
        }
    });

    return Rune;
});
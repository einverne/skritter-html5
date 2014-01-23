/**
 * @module Skritter
 * @param templateRune
 * @param Canvas
 * @param CanvasStroke
 * @param LeapController
 * @param Prompt
 * @param Recognizer
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-rune.html',
    'views/prompts/Canvas',
    'models/CanvasStroke',
    'models/LeapController',
    'views/prompts/Prompt',
    'Recognizer'
], function(templateRune, Canvas, CanvasStroke, LeapController, Prompt, Recognizer) {
    /**
     * @class PromptRune
     */
    var Rune = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Rune.canvas = new Canvas();
            Rune.failedAttempts = 0;
            Rune.leap = new LeapController();
            Rune.maxFailedAttempts = 3;
            Rune.minStrokeDistance = 10;
            Rune.teach = false;
            this.listenTo(Rune.canvas, 'input:down', this.handleInputDown);
            this.listenTo(Rune.canvas, 'input:up', this.handleInputUp);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRune);
            Rune.canvas.setElement(this.$('#canvas-container')).render();
            hammer(this.$('#canvas-container')[0]).on('doubletap', this.handleDoubleTap);
            hammer(this.$('#canvas-container')[0]).on('hold', this.handleHold);
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method clear
         */
        clear: function() {
            Rune.canvas.setLayerAlpha('stroke', 1);
            Rune.canvas.clear('background');
            Rune.canvas.clear('hint');
            Rune.canvas.clear('stroke');
            Rune.canvas.clear('feedback');
        },
        /**
         * @method handleCharacterComplete
         */
        handleCharacterComplete: function() {
            //sets the item as finished and initial review values
            Prompt.dataItem.set('finished', true);
            Prompt.dataItem.setReview(Prompt.gradingButtons.grade(), skritter.timer.getReviewTime(), skritter.timer.getThinkingTime());
            //checks if we should snap or just glow the result
            if (skritter.user.getSetting('squigs'))
                window.setTimeout(function() {
                    for (var i in Prompt.dataItem.get('character').models) {
                        var stroke = Prompt.dataItem.get('character').models[i];
                        Rune.canvas.tweenShape('background', stroke.getUserSprite(), stroke.getInflatedSprite());
                    }
                    Rune.canvas.setLayerAlpha('stroke', 0.3);
                    Rune.canvas.injectLayer('background', Prompt.gradeColorHex[Prompt.gradingButtons.grade()]);
                }, 50);
            this.load();
        },
        /**
         * @method handleDoubleTap
         */
        handleDoubleTap: function() {
            if (!Prompt.finished) {
                Prompt.gradingButtons.select(1).collapse();
                Rune.canvas.drawContainer('hint', Prompt.dataItem.get('character').targets[Prompt.dataItem.get('character').getVariationIndex()]
                        .getCharacterSprite(Prompt.dataItem.get('character').getExpectedStroke().get('position'), 'grey'), 0.3);
                // ISSUE #132: Also flash next stroke when full-character hint is requested.
                var nextStroke = Prompt.dataItem.get('character').getExpectedStroke();
                if (nextStroke)
                    Rune.canvas.drawShape('hint', nextStroke.getInflatedSprite('#87cefa'));
            }
        },
        /**
         * @method handleGradeSelected
         * @param {Number} grade
         */
        handleGradeSelected: function(grade) {
            Prompt.dataItem.review().set('score', Prompt.gradingButtons.grade());
            Rune.canvas.injectLayer('stroke', Prompt.gradeColorHex[grade]);
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
         * @method handleInputUp
         * @param {Arrau} points
         * @param {CreateJS.Shape} shape
         */
        handleInputUp: function(points, shape) {
            this.process(points, shape);
        },
        /**
         * @method handleStrokeDrawn
         * @param {Backbone.Model} result
         */
        handleStrokeDrawn: function(result) {
            //prevents multiple simultaneous strokes from firing the character complete event
            result.set('isTweening', false);
            //check if the character has been completed yet or not with enforced tween checks
            if (Prompt.dataItem.get('character').getStrokeCount(true) >= Prompt.dataItem.get('character').getTargetStrokeCount())
                this.handleCharacterComplete();
        },
        /**
         * @method handleHold
         */
        handleHold: function() {
            Prompt.this.reset();
            Prompt.this.load();
            Rune.canvas.enableInput();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished())
                Prompt.this.next();
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Prompt.data.show.definition();
            Prompt.data.show.reading();
            Prompt.data.show.style();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                Rune.canvas.disableInput();
                Prompt.gradingButtons.select(Prompt.dataItem.getGrade()).collapse();
                if (Prompt.data.isLast())
                    Prompt.data.show.sentence();
                Prompt.data.show.writingAt(1);
                window.setTimeout(function() {
                    hammer(Prompt.this.$('#canvas-container')[0]).on('tap', Prompt.this.handleTap);
                }, 500);
            } else {
                hammer(Prompt.this.$('#canvas-container')[0]).off('tap', Prompt.this.handleTap);
                skritter.timer.start();
                Rune.canvas.enableInput();
                Prompt.data.show.sentenceMasked();
                Prompt.data.show.writingAt();
            }
        },
        /**
         * @method process
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         * @param {Boolean} ignoreCheck
         * @param {Boolean} enforceOrder
         */
        process: function(points, shape, ignoreCheck, enforceOrder) {
            if (points.length > 0 && skritter.fn.getDistance(points[0], points[points.length - 1]) > Rune.minStrokeDistance) {
                //create the stroke from the points to analyze
                var stroke = new CanvasStroke().set('points', points);
                //recognize a stroke based on user input and targets
                var result = new Recognizer(Prompt.dataItem.get('character'),
                        stroke, Prompt.dataItem.get('character').targets).recognize(ignoreCheck, enforceOrder);
                //check if a result exists and that it's not a duplicate
                if (result && !Prompt.dataItem.get('character').containsStroke(result)) {
                    //get the expected stroke based on accepted stroke orders
                    var expected = Prompt.dataItem.get('character').getExpectedStroke(result);
                    //add the stroke to the users character
                    Prompt.dataItem.get('character').add(stroke);
                    //reset the failed attempts counter
                    Rune.failedAttempts = 0;
                    //choose whether to draw the stroke normally or using raw squigs
                    if (skritter.user.getSetting('squigs')) {
                        Rune.canvas.drawShape('stroke', shape);
                        this.handleStrokeDrawn(result);
                    } else {
                        //display feedback if it exists
                        if (result.get('feedback'))
                            Rune.canvas.showMessage(result.get('feedback').toUpperCase());
                        //mark the result as tweening and snap it
                        result.set('isTweening', true);
                        Rune.canvas.tweenShape('stroke', result.getUserSprite(), result.getInflatedSprite(), null, function() {
                            Prompt.this.handleStrokeDrawn(result);
                        });
                        //show a hint if the stroke wasn't in the expected order
                        if (expected && result.get('id') !== expected.get('id'))
                            Rune.canvas.drawShapePhantom('hint', Prompt.dataItem.get('character').getExpectedStroke().getInflatedSprite());
                    }
                    //ISSUE #63: show the grading buttons and grade color preemptively
                    if (Prompt.dataItem.get('character').getStrokeCount(false) >= Prompt.dataItem.get('character').getTargetStrokeCount()) {
                        Rune.canvas.injectLayer('stroke', Prompt.gradeColorHex[Prompt.gradingButtons.grade()]);
                        Prompt.gradingButtons.select().collapse();
                    }
                } else {
                    Rune.failedAttempts++;
                    //if failed too many times show a hint
                    if (Rune.failedAttempts > Rune.maxFailedAttempts) {
                        //ISSUE #64: display grading buttons immediately when failed
                        Prompt.gradingButtons.select(1).collapse();
                        //ISSUE #28: if the find the next stroke then don't try to show a hint
                        var nextStroke = Prompt.dataItem.get('character').getNextStroke();
                        if (nextStroke)
                            Rune.canvas.drawShapePhantom('hint', nextStroke.getInflatedSprite('#87cefa'));
                    }
                }
            }
        },
        /**
         * @method redraw
         */
        redraw: function() {
            Prompt.prototype.redraw.call(this);
            Prompt.this.clear();
            if (Prompt.dataItem.isFinished()) {
                Rune.canvas.drawContainer('stroke', Prompt.dataItem.get('character').getCharacterSprite(null, Prompt.gradeColorHex[Prompt.dataItem.getGrade()]));
            } else {
                Rune.canvas.drawContainer('stroke', Prompt.dataItem.get('character').getCharacterSprite());
            }
        },
        /**
         * @method reset
         */
        reset: function() {
            Prompt.gradingButtons.hide(true);
            Prompt.dataItem.get('character').reset();
            Prompt.dataItem.set('finished', false);
            this.clear();
        },
        /**
         * @method teach
         */
        teach: function() {
            Rune.teach = true;
            Rune.canvas.clear('overlay');
            Prompt.gradingButtons.grade(1);
            //if (Prompt.dataItem.get('character').getStrokeCount() === 0)
            var nextStroke = Prompt.dataItem.get('character').getNextStroke(true);
            if (nextStroke) {
                Rune.canvas.drawShape('overlay', nextStroke.getInflatedSprite('#87cefa'), 1);
            } else {
                Rune.canvas.showMessage('Click to try it from memory.', false);
                //TODO: reset the prompt for the user to try
            }
        }
    });

    return Rune;
});
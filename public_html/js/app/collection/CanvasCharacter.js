/**
 * @module Skritter
 * @submodule Collection
 * @param CanvasStroke
 * @author Joshua McFarland
 */
define([
    'model/CanvasStroke',
    'backbone'
], function(CanvasStroke) {
    /**
     * @class CanvasCharacter
     */
    var CanvasCharacter = Backbone.Collection.extend({
        /**
         * @method initialize
         * @returns {undefined}
         */
        initialize: function() {
            this.targets = [];
        },
        /**
         * @property {CanvasStroke} model
         */
        model: CanvasStroke,
        /**
         * @method comparator
         * @param {CanvasStroke} stroke
         * @returns {CanvasStroke}
         */
        comparator: function(stroke) {
            return stroke.get('position');
        },
        /**
         * Checks the character to see if the stroke already exists either directly or indirectly as
         * a contained double stroke.
         * 
         * @method containsStroke
         * @param {CanvasStroke} stroke
         * @returns {Boolean} Returns true if the character contains the stroke
         */
        containsStroke: function(stroke) {
            var strokeId = stroke.get('id');
            var strokeContains = stroke.getContainedStrokeIds();
            for (var i in this.models) {
                var id = this.models[i].get('id');
                var contains = this.models[i].getContainedStrokeIds();
                //directly check for strokes position
                if (strokeId === id) {
                    return true;
                }
                //checks for existing contained strokes
                if (contains) {
                    for (i in contains) {
                        var contained = contains[i];
                        if (_.contains(strokeContains, contained)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        /**
         * Gets a container with all of the child stroke that character is comprised of and
         * returns them in a single container.
         * 
         * @method getCharacterSprite
         * @returns {Container} A container of sprites contained in the character
         */
        getCharacterSprite: function() {
            var spriteContainer = new createjs.Container();
            spriteContainer.name = 'character';
            for (var i in this.models) {
                spriteContainer.addChild(this.models[i].getInflatedSprite().clone());
            }
            return spriteContainer;
        },
        /**
         * The number of strokes in a row starting from the first that are in the correct order.s
         * 
         * @method getConsecutiveStrokeCount
         * @returns {Number}
         */
        getConsecutiveStrokeCount: function() {
            var strokeCount = 0;
            for (var i in this.models) {
                var stroke = this.models[i];
                var expected = strokeCount + 1;
                if (stroke.get('position') !== expected)
                    break;
                strokeCount += (stroke.has('contains')) ? 2 : 1;
            }
            return strokeCount;
        },
        /**
         * Returns the next expected stroke based on the next stroke.
         * 
         * @method getExpectedStroke
         * @param {CanvasStroke} nextStroke
         * @returns {CanvasStroke}
         */
        getExpectedStroke: function(nextStroke) {
            var position;
            //emulate the next stroke in the character to better predict the variation
            var character = this.clone();
            character.add(nextStroke);
            character.targets = this.targets;
            var index = character.getVariationIndex();
            var consecutive = this.getConsecutiveStrokeCount();
            //select a position based on consecutive strokes
            if (consecutive === 0) {
                position = 1;
            } else {
                position = consecutive + 1;
            }
            //find the expected stroke and return it
            var stroke = character.targets[index].findWhere({position: position});
            if (stroke)
                return stroke;
        },
        /**
         * Returns the next stroke based on the predicted variation.
         * 
         * @method getNextStroke
         * @returns {CanvasStroke}
         */
        getNextStroke: function() {
            var index = this.getVariationIndex();
            var position = this.getConsecutiveStrokeCount() + 1;
            var stroke = this.targets[index].findWhere({position: position});
            if (stroke)
                return stroke;
        },
        /**
         * Returns the index of the variation that matches the currently input character.
         * 
         * @method getVariationIndex
         * @returns {Number}
         */
        getVariationIndex: function() {
            var scores = [];
            //sizes and sets the scores array
            for (var i = 0; i < this.targets.length; i++)
                scores[i] = 0;
            //score each variation based on if it exists in the character
            for (var a in this.models) {
                var strokeId = this.models[a].get('id');
                for (var b in this.targets) {
                    var variation = this.targets[b];
                    if (variation.findWhere({id: strokeId}))
                        scores[b]++;
                }
            }
            console.log(scores);
            return scores.indexOf(Math.max.apply(Math, scores));
        },
        /**
         * Returns a count of the total number of strokes in the character including the broken
         * down double strokes.
         * 
         * @method getStrokeCount
         * @param {Boolean} enforceTweening
         * @returns {Number} The total number of stroke in the character
         */
        getStrokeCount: function(enforceTweening) {
            var strokeCount = 0;
            for (var i in this.models) {
                var stroke = this.models[i];
                if (enforceTweening) {
                    if (!stroke.get('isTweening')) {
                        if (stroke.has('contains')) {
                            strokeCount += stroke.get('contains').length;
                        } else {
                            strokeCount++;
                        }
                    }
                } else {
                    if (stroke.has('contains')) {
                        strokeCount += stroke.get('contains').length;
                    } else {
                        strokeCount++;
                    }

                }
            }
            return strokeCount;
        },
        /**
         * Returns the stroke highest possible stroke count out of all of the targets.
         * 
         * @method getTargetStrokeCount
         * @returns {Number}
         */
        getTargetStrokeCount: function() {
            var strokeCount = 0;
            for (var a in this.targets)
            {
                if (this.targets[a].getStrokeCount() > strokeCount) {
                    strokeCount = this.targets[a].getStrokeCount();
                }
            }
            return strokeCount;
        }
    });


    return CanvasCharacter;
});
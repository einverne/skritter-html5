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
         * @property {CanvasStroke} model
         */
        model: CanvasStroke,
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
         * Returns a count of the total number of strokes in the character including the broken
         * down double strokes.
         * 
         * @method getStrokeCount
         * @returns {Number} The total number of stroke in the character
         */
        getStrokeCount: function() {
            var strokeCount = 0;
            for (var i in this.models) {
                if (this.models[i].has('contains')) {
                    strokeCount += this.models[i].get('contains').length;
                } else {
                    strokeCount++;
                }
            }
            return strokeCount;
        }

    });


    return CanvasCharacter;
});
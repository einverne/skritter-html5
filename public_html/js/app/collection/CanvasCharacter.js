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
         * @method containsStroke
         * @param {CanvasStroke} stroke
         * @returns {Boolean} True if the character contains the stroke
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
         * @method getCharacterSprite
         * @returns {Container} A container of sprites contained in the character
         */
        getCharacterSprite: function() {
            var spriteContainer = new createjs.Container();
            for (var i in this.models) {
                spriteContainer.addChild(this.models[i].getInflatedSprite().clone());
            }
            return spriteContainer;
        },
        /**
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
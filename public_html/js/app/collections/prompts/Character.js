/**
 * @module Skritter
 * @submodule Collections
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'models/prompts/Stroke'
], function(Stroke) {
    /**
     * @class PromptCharacter
     */
    var Character = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.targets = [];
        },
        /**
         * @property {CanvasStroke} model
         */
        model: Stroke,
        /**
         * @method comparator
         * @param {Backbone.Model} stroke
         * @returns {Number}
         */
        comparator: function(stroke) {
            return stroke.get('position');
        },
        /**
         * @method shape
         * @param {Number} size
         * @param {Number} excludeStrokePosition
         * @param {String} color
         * @returns {CreateJS.Container}
         */
        shape: function(size, excludeStrokePosition, color) {
            color = (color) ? color : '#000000';
            var shapeContainer = new createjs.Container();
            shapeContainer.name = 'character';
            for (var i = 0, length = this.models.length; i < length; i++)
                if (i !== excludeStrokePosition - 1)
                    shapeContainer.addChild(this.models[i].inflatedShape(size, color));
            return shapeContainer;
        }
    });

    return Character;
});
/**
 * @module Skritter
 * @submodule Models
 * @param PromptCharacter
 * @param PromptStroke
 * @author Joshua McFarland
 */
define([
    'collections/prompts/Character',
    'models/prompts/Stroke'
], function(PromptCharacter, PromptStroke) {
    /**
     * @class Stroke
     */
    var Stroke = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'rune',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('stroke', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method canvasCharacter
         * @returns {Backbone.Model}
         */
        canvasCharacter: function() {
            var character = new PromptCharacter();
            var targets = [];
            var variations = this.get('strokes');
            var rune = this.get('rune');
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var target = new PromptCharacter();
                var variation = variations[a];
                var position = 1;
                target.name = rune;
                target.variation = a + 1;
                for (var b = 0, lengthB = variation.length; b < lengthB; b++) {
                    var stroke = new PromptStroke();
                    var data = variation[b];
                    var bitmapId = data[0];
                    var params = skritter.params.findWhere({bitmapId: bitmapId});
                    stroke.set({
                        bitmapId: bitmapId,
                        data: data,
                        id: position + '|' + bitmapId,
                        position: position,
                        shape: skritter.assets.stroke(bitmapId)
                    });
                    if (params.has('contains')) {
                        stroke.set('contains', params.get('contains'));
                        position += 2;
                    } else {
                        position += 1;
                    }
                    target.add(stroke);
                }
                targets.push(target);
            }
            character.targets = targets;
            return character;
        }
    });

    return Stroke;
});
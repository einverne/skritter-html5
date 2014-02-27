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
         * @method canvasCharacters
         * @returns {Backbone.Model}
         */
        canvasCharacters: function() {
            var characters = [];
            var variations = this.get('strokes');
            var rune = this.get('rune');
            for (var a = 0, lengthA = variations.length; a < lengthA; a++) {
                var character = new PromptCharacter();
                var variation = variations[a];
                var position = 1;
                character.name = rune;
                character.variation = a + 1;
                for (var b = 0, lengthB = variation.length; b < lengthB; b++) {
                    var stroke = new PromptStroke();
                    var data = variation[b];
                    var bitmapId = data[0];
                    var params = skritter.params.findWhere({bitmapId: bitmapId});
                    character.add({
                        bitmapId: bitmapId,
                        data: data[0],
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
                    character.add(stroke);
                }
                characters.push(character);
            }
            return characters;
        }
    });

    return Stroke;
});
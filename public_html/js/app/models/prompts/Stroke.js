/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland 
 */
define(function() {
    /**
     * @class PromptStroke
     */
    var Stroke = Backbone.Model.extend({
        /**
         * Returns the sprite transformed to fit the stroke data and canvas size.
         * 
         * @method inflatedSprite
         * @param {Number} size
         * @param {String} color
         * @return {unresolved}
         */
        inflatedShape: function(size, color) {
            var shape = skritter.assets.stroke(this.get('bitmapId'), color);
            var spriteBounds = shape.getBounds();
            var data = this.inflatedData(size);
            var ms = shape.getMatrix();

            var sx = data.w / spriteBounds.width;
            var sy = data.h / spriteBounds.height;
            ms.scale(sx, sy);
            ms.translate(-data.w / 2, -data.h / 2);
            ms.rotate(data.rot * Math.PI / 180);
            var t = ms.decompose();

            shape.setTransform(t.x, t.y, t.scaleX, t.scaleY, t.rotation, t.skewX, t.skewY);
            var finalBounds = shape.getTransformedBounds();
            shape.name = 'stroke';
            shape.x += finalBounds.width / 2 + data.x;
            shape.y += finalBounds.height / 2 + data.y;

            return shape;
        },
        /**
         * Returns an inflated version of the data based on the canvas size.
         * 
         * @method inflatedData
         * @param {Number} size
         * @return {Object}
         */
        inflatedData: function(size) {
            var bounds = this.get('shape').getBounds();
            var data = this.get('data');
            return {
                n: data[0],
                x: data[1] * size,
                y: data[2] * size,
                w: data[3] * size,
                h: data[4] * size,
                scaleX: (data[3] * size) / bounds.width,
                scaleY: (data[4] * size) / bounds.height,
                rot: -data[5]
            };
        }
    });

    return Stroke;
});
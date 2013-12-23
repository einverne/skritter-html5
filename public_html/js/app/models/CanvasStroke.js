/**
 * @module Skritter
 * @submodule Model
 * @param Mauler
 * @param Shortstraw
 * @author Joshua McFarland 
 */
define([
    'Mauler',
    'Shortstraw',
    'backbone',
    'createjs.easel'
], function(Mauler, Shortstraw) {
    /**
     * @class CanvasStroke
     */
    var CanvasStroke = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change:points', function(stroke) {
                var points = _.clone(stroke.get('points'));
                stroke.set('corners', Shortstraw(points));
            });
        },
        /**
         * @property {Object} defaults
         */
        defaults: {
            isTweening: false
        },
        /**
         * Returns the angle created by the starting and ending point of the entire object.
         * 
         * @method getAngle
         * @return {Number} description
         */
        getAngle: function() {
            return skritter.fn.getAngle(this.get('points'));
        },
        /**
         * Returns the contained stroke ids.
         * 
         * @method getContainedStrokeIds
         * @return {Array}
         */
        getContainedStrokeIds: function() {
            var ids = [];

            if (!this.has('contains')) {
                ids.push(this.get('id'));
                return ids;
            }

            var contains = this.get('contains');
            var position = this.get('position');
            for (var i in contains)
            {
                var contained = contains[i];
                ids.push(position + '|' + contained);
                ids.push((position + 1) + '|' + contained);
            }

            return ids;
        },
        /**
         * Returns the length of the stroke based on the distance between the corner segments.
         * 
         * @method getLength
         * @return {Number}
         */
        getLength: function() {
            var length = 0;
            for (var i = 0; i < this.get('corners').length - 1; i++)
                length += skritter.fn.getDistance(this.get('corners')[i], this.get('corners')[i + 1]);
            return length;
        },
        /**
         * Returns the sprite transformed to fit the stroke data and canvas size.
         * 
         * @method getInflatedSprite
         * @param {String} color
         * @return {unresolved}
         */
        getInflatedSprite: function(color) {
            var sprite = skritter.assets.getStroke(this.get('bitmapId'), color);
            var spriteBounds = sprite.getBounds();
            var data = this.getInflatedData();         
            var ms = sprite.getMatrix();
            
            var sx = data.w / spriteBounds.width;
            var sy = data.h / spriteBounds.height;
            ms.scale(sx, sy);
            ms.translate(-data.w / 2, -data.h / 2);
            ms.rotate(data.rot * Math.PI / 180);
            var t = ms.decompose();

            sprite.setTransform(t.x, t.y, t.scaleX, t.scaleY, t.rotation, t.skewX, t.skewY);
            var finalBounds = sprite.getTransformedBounds();          
            sprite.x += finalBounds.width / 2 + data.x;
            sprite.y += finalBounds.height / 2 + data.y;

            return sprite;
        },
        /**
         * Returns an inflated version of the data based on the canvas size.
         * 
         * @method getInflatedData
         * @return {Object}
         */
        getInflatedData: function() {
            var bounds = this.get('sprite').getBounds();
            var canvasSize = skritter.settings.get('canvasSize');
            var data = this.get('data');
            return {
                n: data[0],
                x: data[1] * canvasSize,
                y: data[2] * canvasSize,
                w: data[3] * canvasSize,
                h: data[4] * canvasSize,
                scaleX: (data[3] * canvasSize) / bounds.width,
                scaleY: (data[4] * canvasSize) / bounds.height,
                rot: -data[5]
            };
        },
        /**
         * Returns an inflated version of the params based on the canvas size.
         * 
         * @method getInflatedParams
         * @return {Array}
         */
        getInflatedParams: function() {
            var params = skritter.data.params.where({bitmapId: this.get('bitmapId')});
            var inflatedParams = [];
            for (var p in params) {
                var param = params[p].clone();
                //inflates the param corners
                var corners = _.cloneDeep(param.get('corners'));
                for (var c in corners) {
                    var inflatedCorner = this.getInflatedSprite().getMatrix().transformPoint(corners[c].x, corners[c].y);
                    corners[c].x = inflatedCorner.x;
                    corners[c].y = inflatedCorner.y;
                }
                param.set('corners', corners);
                //inflates the param deviations
                var deviations = _.cloneDeep(param.get('deviations'));
                for (var d in deviations) {
                    var inflatedDeviation = this.getInflatedSprite().getMatrix().transformPoint(deviations[d].x, deviations[d].y);
                    deviations[d].x = inflatedDeviation.x;
                    deviations[d].y = inflatedDeviation.y;
                }
                param.set('deviations', deviations);
                inflatedParams.push(param);
            }
            return inflatedParams;
        },
        /**
         * Returns an object of the bounding rectangle of the points.
         * 
         * @method getRectangle
         * @return {Object}
         */
        getRectangle: function() {
            var canvasSize = skritter.settings.get('canvasSize');
            return skritter.fn.getBoundingRectangle(this.get('points'), canvasSize, canvasSize, 14);
        },
        /**
         * Returns an object of the bounding rectangle of the corners.
         * 
         * @method getRectangleCorners
         * @return {Object}
         */
        getRectangleCorners: function() {
            var canvasSize = skritter.settings.get('canvasSize');
            return skritter.fn.getBoundingRectangle(this.get('corners'), canvasSize, canvasSize, 14);
        },
        /**
         * Returns the raw sprite without any transformations or positioning.
         * 
         * @method getSprite
         * @param {String} color
         * @returns {Bitmap}
         */
        getSprite: function(color) {
            return skritter.assets.getStroke(this.get('bitmapId', color));
        },
        /**
         * Returns a sprite of the target stroke that has been altered based on the users input.
         * 
         * @method getUserSprite
         * @param {String} color
         * @return {Bitmap}
         */
        getUserSprite: function(color) {
            var sprite = this.getInflatedSprite(color);
            var rect = this.getRectangle();
            sprite.x = rect.x;
            sprite.y = rect.y;
            return Mauler.tweak(sprite, this.get('bitmapId'));
        }

    });

    return CanvasStroke;
});
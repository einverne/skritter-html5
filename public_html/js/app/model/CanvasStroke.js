/**
 * @module Skritter
 * @submodule Model
 * @param Mauler
 * @param Shortstraw
 * @author Joshua McFarland
 * 
 * Properties
 * bitmap
 * bitmapId
 * corners
 * points
 * position
 * rune
 * stroke
 * 
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
        initialize: function() {
            this.on('change:points', function(stroke) {
                stroke.set('corners', Shortstraw(stroke.get('points')));
            });
        },
        /**
         * @method getAngle
         * @return {Number} description
         */
        getAngle: function() {
            return Skritter.fn.getAngle(this.get('points'));
        },
        /**
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
         * @method getLength
         * @return {Number}
         */
        getLength: function() {
            var length = 0;
            for (var i = 0; i < this.get('corners').length - 1; i++)
            {
                length += Skritter.fn.getDistance(this.get('corners')[i], this.get('corners')[i + 1]);
            }
            return length;
        },
        /**
         * @method getInflatedSprite
         * @return {unresolved}
         */
        getInflatedSprite: function() {
            var sprite = this.get('sprite').clone();
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
            var bounds = sprite.getTransformedBounds();            
            sprite.x += bounds.width / 2 + data.x;
            sprite.y += bounds.height / 2 + data.y;

            return sprite;
        },
        /**
         * @method getInflatedData
         * @return {Object}
         */
        getInflatedData: function() {
            var bounds = this.get('sprite').getBounds();
            var canvasSize = Skritter.settings.get('canvasSize');
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
         * @method getInflatedParams
         * @return {Array}
         */
        getInflatedParams: function() {
            var data = this.getInflatedData();
            var params = Skritter.study.params.where({bitmapId: this.get('bitmapId')});
            var inflatedParams = [];
            for (var p in params) {
                var param = params[p].clone();

                //inflates the param corners
                var corners = _.cloneDeep(param.get('corners'));
                for (var c in corners)
                {
                    corners[c].x = corners[c].x * data.scaleX + data.x;
                    corners[c].y = corners[c].y * data.scaleY + data.y;
                }
                param.set('corners', corners);

                //inflates the param deviations
                var deviations = _.cloneDeep(param.get('deviations'));
                for (var d in deviations)
                {
                    deviations[d].x = deviations[d].x * data.scaleX + data.x;
                    deviations[d].y = deviations[d].y * data.scaleY + data.y;
                }
                param.set('deviations', deviations);
                inflatedParams.push(param);
            }
            return inflatedParams;
        },
        /**
         * @method getRectangle
         * @return {Object}
         */
        getRectangle: function() {
            var canvasSize = Skritter.settings.get('canvasSize');
            return Skritter.fn.getBoundingRectangle(this.get('points'), canvasSize, canvasSize, 14);
        },
        /**
         * 
         * @return {@exp;Skritter@pro;fn@call;getBoundingRectangle}
         */
        getRectangleCorners: function() {
            var canvasSize = Skritter.settings.get('canvasSize');
            return Skritter.fn.getBoundingRectangle(this.get('corners'), canvasSize, canvasSize, 14);
        },
        /**
         * @method getSprite
         * @returns {Bitmap}
         */
        getSprite: function() {
            return this.get('sprite');
        },
        /**
         * @method getUserSprite
         * @return {Bitmap}
         */
        getUserSprite: function() {
            var sprite = this.getInflatedSprite();
            var rect = this.getRectangle();
            sprite.x = rect.x;
            sprite.y = rect.y;
            return Mauler.tweak(sprite, this.get('bitmapId'));
        }

    });


    return CanvasStroke;
});
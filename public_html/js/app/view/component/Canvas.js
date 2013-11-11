/**
 * @module Skritter
 * @submodule Component
 * @author Joshua McFarland
 */
define([
    'backbone',
    'createjs.easel',
    'createjs.tween'
], function() {
    /**
     * @class Canvas
     */
    var Canvas = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Canvas.grid = true;
            Canvas.gridColor = 'grey';
            Canvas.gridLineWidth = 1;
            Canvas.points = [];
            Canvas.size = Skritter.settings.get('canvasSize');
            Canvas.strokeColor = '#000000';
            Canvas.strokeSize = 12;
            Canvas.strokeCapStyle = 'round';
            Canvas.strokeJointStyle = 'round';
            Canvas.squigColor = 'orange';
            Canvas.textColor = 'orange';
            Canvas.textFont = '12px Arial';
            Canvas.element = this.initElement();
            Canvas.stage = this.initStage();
            createjs.Touch.enable(Canvas.stage);
            createjs.Ticker.addEventListener('tick', this.tick);
            this.initListeners();
        },
        /**
         * @method render
         * @returns {Canvas}
         */
        render: function() {
            this.$el.html(Canvas.element);
            this.createLayer('grid');
            this.createLayer('input');
            if (Canvas.grid)
                this.drawGrid('grid');
            //ISSUE #18: drawing a dummy sprite fixes the delayed tween problem in Chrome
            //it needs to be a clone otherwise the sprite will globally have the alpha set
            var dummySprite = Skritter.assets.getStroke(0);
            dummySprite.alpha = 0.0001;
            Canvas.stage.addChildAt(dummySprite, 0);
            
            return this;
        },
        /**
         * @method initElement
         * @returns {DOMElement}
         */
        initElement: function() {
            var element = document.createElement('canvas');
            element.setAttribute('id', 'prompt-canvas');
            element.setAttribute('width', Canvas.size);
            element.setAttribute('height', Canvas.size);
            return element;
        },
        /**
         * @method initListeners
         */
        initListeners: function() {
            this.listenTo(Skritter.settings, 'resize', this.resize);
        },
        /**
         * @method initStage
         * @returns {Stage}
         */
        initStage: function() {
            var stage = new createjs.Stage(Canvas.element);
            stage.enableDOMEvents(true);
            stage.autoClear = true;
            return stage;
        },
        /**
         * @method clear
         * @param {String} layerName
         * @returns {Container}
         */
        clear: function(layerName) {
            var layer;
            if (layerName) {
                layer = this.getLayer(layerName);
                layer.removeAllChildren();
                layer.uncache();
                return layer;
            }
            var layers = this.getLayers();
            for (var i in layers) {
                layers[i].removeAllChildren();
                layers[i].uncache();
            }
            return Canvas.stage;
        },
        /**
         * @method createLayer
         * @param {String} name
         * @returns {Container}
         */
        createLayer: function(name) {
            var layer = new createjs.Container();
            layer.name = 'layer-' + name;
            Canvas.stage.addChild(layer);
            return layer;
        },
        /**
         * @method disableGrid
         * @returns {undefined}
         */
        disableGrid: function() {
            Canvas.grid = false;
        },
        /**
         * Disables all touch input on the canvas. This is most commonly used when a user has
         * already completed a prompt and it needs grading.
         * 
         * @method disableInput
         */
        disableInput: function() {
            Canvas.stage.removeAllEventListeners();
        },
        /**
         * @method drawCharacter
         * @param {Bitmap} bitmap
         * @param {String} layerName
         * @param {Number} alpha
         * @returns {Bitmap}
         */
        drawCharacter: function(bitmap, layerName, alpha) {
            var layer = this.getLayer(layerName);
            if (layer.getChildByName('character'))
                layer.removeChild(layer.getChildByName('character'));
            if (alpha) {
                bitmap.filters = [new createjs.ColorFilter(0, 0, 0, alpha, 0, 0, 0, 0)];
                bitmap.cache(0, 0, Canvas.size, Canvas.size);
            }
            layer.addChild(bitmap);
            return bitmap;
        },
        /**
         * Draws the character to the background using the font rather than assembling
         * the character strokes.
         * 
         * @method drawCharacterFromText
         * @param {String} text
         * @param {String} layerName
         * @param {Number} alpha
         * @returns {Text}
         */
        drawCharacterFromFont: function(text, layerName, alpha) {
            text = new createjs.Text(text, Canvas.size + 'px simkai', 'black');
            if (alpha)
                text.alpha = alpha;
            return this.getLayer(layerName).addChild(text);
        },
        /**
         * @method drawGrid
         * @param {String} layerName
         * @param {String} color
         * @returns {Container}
         */
        drawGrid: function(layerName, color) {
            color = (color) ? color : Canvas.gridColor;
            var grid = new createjs.Shape();
            var layer = this.getLayer(layerName);
            if (layer.getChildByName('grid'))
                layer.removeChild(layer.getChildByName('grid'));
            grid.name = 'grid';
            grid.graphics.beginStroke(color).setStrokeStyle(Canvas.gridLineWidth, Canvas.strokeCapStyle, Canvas.strokeJointStyle);
            grid.graphics.moveTo(Canvas.size / 2, 0).lineTo(Canvas.size / 2, Canvas.size);
            grid.graphics.moveTo(0, Canvas.size / 2).lineTo(Canvas.size, Canvas.size / 2);
            grid.graphics.moveTo(0, 0).lineTo(Canvas.size, Canvas.size);
            grid.graphics.moveTo(Canvas.size, 0).lineTo(0, Canvas.size);
            layer.addChild(grid);
            grid.graphics.endStroke();
            return grid;
        },
        /**
         * @method drawParam
         * @param {StudyParam} param
         * @param {String} layerName
         * @returns {Shape}
         */
        drawParam: function(param, layerName) {
            var circle;
            var layer = this.getLayer(layerName);
            var corners = param.get('corners');
            for (var c in corners) {
                var corner = corners[c];
                circle = new createjs.Shape();
                circle.graphics.beginFill('orange').drawCircle(corner.x, corner.y, 5);
                layer.addChild(circle);
            }
            var deviations = param.get('deviations');
            for (var d in deviations) {
                var deviation = deviations[d];
                circle = new createjs.Shape();
                circle.graphics.beginFill('purple').drawCircle(deviation.x, deviation.y, 5);
                layer.addChild(circle);
            }
            return circle;
        },
        /**
         * @method drawPhantomStroke
         * @param {Bitmap} bitmap
         * @param {String} layerName
         * @param {Function} callback
         * @returns {Bitmap}
         */
        drawPhantomStroke: function(bitmap, layerName, callback) {
            bitmap.filters = [new createjs.ColorFilter(0, 0, 0, 1, 135, 206, 250, 0)];
            bitmap.cache(0, 0, Canvas.size, Canvas.size);
            var layer = this.getLayer(layerName);
            layer.addChild(bitmap);
            createjs.Tween.get(bitmap).to({alpha: 0}, 500).call(function() {
                layer.removeChild(bitmap);
                if (typeof callback === 'function')
                    callback();
            });
            return bitmap;
        },
        /**
         * @method drawSquig
         * @param {Array} points
         * @param {String} layerName
         * @param {Number} alpha
         * @returns {Shape}
         */
        drawSquig: function(points, layerName, alpha) {
            var marker = new createjs.Shape();
            var midPoint;
            var prevPoint = points[0];
            var prevMidPoint = points[0];
            marker.graphics.setStrokeStyle(Canvas.strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle).beginStroke(Canvas.squigColor);
            for (var p in points)
            {
                midPoint = new createjs.Point(prevPoint.x + points[p].x >> 1, prevPoint.y + points[p].y >> 1);
                marker.graphics.moveTo(midPoint.x, midPoint.y).curveTo(prevPoint.x, prevPoint.y, prevMidPoint.x, prevMidPoint.y);
                prevPoint = points[p];
                prevMidPoint = midPoint;
            }
            if (alpha)
                marker.alpha = alpha;
            marker.graphics.endStroke();
            this.getLayer(layerName).addChild(marker);
            Canvas.stage.update();
            return marker;
        },
        /**
         * @method drawStroke
         * @param {Bitmap} bitmap
         * @param {String} layerName
         * @param {Number} alpha
         * @returns {Bitmap}
         */
        drawStroke: function(bitmap, layerName, alpha) {
            bitmap = this.getLayer(layerName).addChildAt(bitmap, 0);
            if (alpha)
                bitmap.alpha = alpha;
            return bitmap;
        },
        /**
         * Draws text to the canvas on the message layer. If a position isn't specified then
         * it defaults to the bottom center of the canvas.
         * 
         * @method drawText
         * @param {String} text
         * @param {String} layerName
         * @param {String} color
         * @param {String} font
         * @param {Number} x
         * @param {Number} y
         * @returns {Text}
         */
        drawText: function(text, layerName, color, font, x, y) {
            font = (font) ? font : Canvas.textFont;
            color = (color) ? color : Canvas.textColor;
            text = new createjs.Text(text, font, color);
            var layer = this.getLayer(layerName);
            if (x) {
                text.x = x;
            } else {
                text.x = (Canvas.size / 2) - (text.getMeasuredWidth() / 2);
            }
            if (y) {
                text.y = y;
            } else {
                text.y = Canvas.size * 0.9;
            }
            layer.addChild(text);
            createjs.Tween.get(text).wait(2000).to({alpha: 0}, 500).call(function() {
                layer.removeChild(text);
            });
            return text;
        },
        /**
         * @method drawTweenedStroke
         * @param {Bitmap} fromBitmap
         * @param {Bitmap} toBitmap
         * @param {String} layerName
         * @param {Function} callback
         * @returns {Bitmap}
         */
        drawTweenedStroke: function(fromBitmap, toBitmap, layerName, callback) {
            this.getLayer(layerName).addChildAt(fromBitmap, 0);
            createjs.Tween.get(fromBitmap).to(toBitmap, Skritter.user.getAnimationSpeed(), createjs.Ease.backOut).call(function() {
                if (typeof callback === 'function')
                    callback();
            });
            return toBitmap;
        },
        /**
         * @method fadeLayer
         * @param {String} layerName
         * @param {Function} callback
         * @returns {Container}
         */
        fadeLayer: function(layerName, callback) {
            var layer = this.getLayer(layerName);
            if (layer.getNumChildren() > 0) {
                createjs.Tween.get(layer).to({alpha: 0}, 750).call(function() {
                    layer.removeAllChildren();
                    layer.alpha = 1.0;
                    if (typeof callback === 'function')
                        callback(layer);
                });
            }
            return layer;
        },
        /**
         * @method filterLayerColor
         * @param {String} layerName
         * @param {ColorFilter} filter
         * @returns {Container}
         */
        filterLayerColor: function(layerName, filter) {
            var layer = this.getLayer(layerName);
            layer.filters = [filter];
            layer.cache(0, 0, Canvas.size, Canvas.size);
            return layer;
        },
        /**
         * @method getLayer
         * @param {String} name
         * @returns {Container}
         */
        getLayer: function(name) {
            return Canvas.stage.getChildByName('layer-' + name);
        },
        /**
         * @method getLayers
         * @returns {Array}
         */
        getLayers: function() {
            var layers = [];
            for (var i in Canvas.stage.children) {
                var child = Canvas.stage.children[i];
                if (child.name && child.name.indexOf('layer-') > -1)
                    layers.push(Canvas.stage.children[i]);
            }
            return layers;
        },
        /**
         * @method enableGrid
         * @returns {undefined}
         */
        enableGrid: function() {
            Canvas.grid = true;
        },
        /**
         * Enables touch input and drawing on the canvas. It also handles the immediate ink
         * traced by the finger.
         * 
         * @method enableInput
         */
        enableInput: function() {
            var self = this;
            var layer = this.getLayer('input');
            var oldPt, oldMidPt, points;
            var stage = Canvas.stage;
            var marker = new createjs.Shape();
            layer.addChild(marker);
            var down = function() {
                points = [];
                oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
                self.triggerMouseDown(oldPt);
                oldMidPt = oldPt;
                Canvas.points.push(oldPt.clone());
                marker.graphics.beginStroke(Canvas.strokeColor);
                stage.addEventListener('stagemousemove', move);
                stage.addEventListener('stagemouseup', up);
            };
            var move = function() {
                var point = new createjs.Point(stage.mouseX, stage.mouseY);
                var midPt = new createjs.Point(oldPt.x + point.x >> 1, oldPt.y + point.y >> 1);
                //disable the pressurized stroke size on mobile to help speed things up
                if (Skritter.fn.isMobile()) {
                    marker.graphics
                            .setStrokeStyle(Canvas.strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                            .moveTo(midPt.x, midPt.y)
                            .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
                } else {
                    marker.graphics
                            .setStrokeStyle(Skritter.fn.getPressurizedStrokeSize(point, oldPt), Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                            .moveTo(midPt.x, midPt.y)
                            .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
                }
                oldPt.x = point.x;
                oldPt.y = point.y;
                oldMidPt.x = midPt.x;
                oldMidPt.y = midPt.y;
                points.push(oldPt.clone());
                stage.update();
            };
            var up = function up(event) {
                marker.graphics.endStroke();
                if (isOnCanvas(event)) {
                    self.triggerMouseUp(points);
                }
                stage.removeEventListener('stagemousemove', move);
                stage.removeEventListener('stagemouseup', up);
                marker.graphics.clear();
            };
            var isOnCanvas = function(event) {
                var x = event.rawX;
                var y = event.rawY;
                if (x >= 0 && x < Canvas.size && y >= 0 && y < Canvas.size)
                    return true;
            };
            if (!stage.hasEventListener('stagemousedown'))
                stage.addEventListener('stagemousedown', down);
        },
        /**
         * @method setLayerAlpha
         * @param {String} layerName
         * @param {Number} alpha
         * @returns {Container}
         */
        setLayerAlpha: function(layerName, alpha) {
            var layer = this.getLayer(layerName);
            layer.alpha = alpha;
            return layer;
        },
        /**
         * @method resize
         * @param {Object} event
         */
        resize: function(event) {
            Canvas.size = event.canvas;
            Canvas.element.setAttribute('width', Canvas.size);
            Canvas.element.setAttribute('height', Canvas.size);
            $('#canvas-container').width(Canvas.size);
            $('#canvas-container').height(Canvas.size);
            this.drawGrid('grid');
        },
        /**
         * @method tick
         */
        tick: function() {
            Canvas.stage.update();
        },
        /**
         * Enables the view to fire events when the canvas has been touched.
         * 
         * @method triggerMouseDown
         * @param {Object} point
         */
        triggerMouseDown: function(point) {
            this.trigger('mousedown', point);
        },
        /**
         * Enables the view to fire events when the canvas touch has been released.
         * 
         * @method triggerMouseUp
         * @param {Array} points
         */
        triggerMouseUp: function(points) {
            this.trigger('mouseup', points);
        }
    });
    
    
    return Canvas;
});
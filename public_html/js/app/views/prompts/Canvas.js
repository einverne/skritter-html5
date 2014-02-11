/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Canvas
     */
    var Canvas = Backbone.View.extend({
        /**
         * @method initialize
         * @param {Object} options
         */
        initialize: function(options) {
            Canvas.this = this;
            Canvas.gridColor = 'grey';
            Canvas.gridLineWidth = 1;
            Canvas.size = (options && options.size) ? options.size : skritter.settings.get('canvasSize') ;
            Canvas.strokeColor = '#000000';
            Canvas.strokeSize = 12;
            Canvas.strokeCapStyle = 'round';
            Canvas.strokeJointStyle = 'round';
            Canvas.squigColor = '#000000';
            Canvas.textColor = '#000000';
            Canvas.textFont = 'Arial';
            Canvas.textSize = '12px';
            Canvas.touchElement = this._createTouchElement();
            Canvas.touchStage = this._createTouchStage(Canvas.touchElement);
            Canvas.element = this._createElement();
            Canvas.stage = this._createStage(Canvas.element);
            createjs.Ticker.addEventListener('tick', Canvas.stage);
            this.listenTo(skritter.settings, 'resize', this.resize);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html('');
            this.$el.append(Canvas.element);
            this.$el.append(Canvas.touchElement);
            this.createLayer('grid');
            this.createLayer('background');
            this.createLayer('hint');
            this.createLayer('stroke');
            this.createLayer('overlay');
            this.createLayer('feedback');
            this.drawGrid('grid');
            return this;
        },
        /**
         * @method initElement
         * @returns {DOMElement}
         */
        _createElement: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-display';
            element.width = Canvas.size;
            element.height = Canvas.size;
            return element;
        },
        /**
         * @method initStage
         * @returns {Stage}
         */
        _createStage: function(element) {
            var stage = new createjs.Stage(element);
            stage.autoClear = true;
            stage.enableDOMEvents(false);
            createjs.Ticker.setFPS(24);
            return stage;
        },
        _createTouchElement: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-touch';
            element.width = Canvas.size;
            element.height = Canvas.size;
            return element;
        },
        _createTouchStage: function(element) {
            var stage = new createjs.Stage(element);
            stage.autoClear = false;
            stage.enableDOMEvents(true);
            createjs.Touch.enable(stage);
            return stage;
        },
        /**
         * @method clear
         * @param {String} layerName
         * @returns {Backbone.View}
         */
        clear: function(layerName) {
            if (layerName) {
                var layer = this.getLayer(layerName);
                layer.removeAllChildren();
                layer.uncache();
            } else {
                var layers = this.getLayers();
                for (var i in layers) {
                    layers[i].removeAllChildren();
                    layers[i].uncache();
                }
            }
            return this;
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
        disableInput: function() {
            Canvas.stage.removeAllEventListeners();
        },
        /**
         * Draws the to the background using a font rather than assembling
         * the character strokes.
         * 
         * @method drawCharacterFromFont
         * @param {String} layerName
         * @param {String} character
         * @param {String} font
         * @param {Number} alpha
         * @param {String} color
         * @returns {CreateJS.Container}
         */
        drawCharacterFromFont: function(layerName, character, font, alpha, color) {
            var layer = this.getLayer(layerName);
            color = (color) ? color : Canvas.textColor;
            font = (font) ? font : Canvas.textFont;
            var text = new createjs.Text(character, skritter.settings.get('canvasSize') + 'px ' + font, color);
            text.alpha = (alpha) ? alpha : 1;
            layer.addChild(text);
            if (layer.cacheCanvas)
                layer.updateCache();
            return layer;
        },
        /**
         * @method drawContainer
         * @param {Bitmap} layerName
         * @param {String} container
         * @param {Number} alpha
         * @returns {Bitmap}
         */
        drawContainer: function(layerName, container, alpha) {
            var layer = this.getLayer(layerName);
            if (layer.getChildByName('character'))
                layer.removeChild(layer.getChildByName('character'));
            if (alpha) {
                container.cache(0, 0, Canvas.size, Canvas.size);
                container.filters = [new createjs.ColorFilter(0, 0, 0, alpha, 0, 0, 0, 0)];
            }
            layer.addChildAt(container, 0);
            return container;
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
         * @method drawShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Number} alpha
         * @returns {Bitmap}
         */
        drawShape: function(layerName, shape, alpha) {
            shape.alpha = (alpha) ? alpha : 1;
            this.getLayer(layerName).addChild(shape);
            return this;
        },
        /**
         * @method drawShapePhantom
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Function} callback
         * @returns {CreateJS.Shape}
         */
        drawShapePhantom: function(layerName, shape, callback) {
            var layer = this.getLayer(layerName);
            layer.addChild(shape);
            createjs.Tween.get(shape).wait(300).to({alpha: 0}, 1000).call(function() {
                layer.removeChild(shape);
                if (typeof callback === 'function')
                    callback();
            });
            return shape;
        },
        /**
         * @method enableInput
         */
        enableInput: function() {
            var oldPt, oldMidPt, points;
            var stage = Canvas.touchStage;
            if (!stage.hasEventListener('stagemousedown')) {
                var marker = new createjs.Shape();
                var shape = new createjs.Shape();
                stage.addChild(marker);
                stage.addEventListener('stagemousedown', down);
            }
            function down() {
                points = [];
                oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
                Canvas.this.triggerInputDown(oldPt);
                oldMidPt = oldPt;
                stage.addEventListener('stagemousemove', move);
                stage.addEventListener('stagemouseup', up);
            }
            function move() {
                var point = new createjs.Point(stage.mouseX, stage.mouseY);
                var midPt = new createjs.Point(oldPt.x + point.x >> 1, oldPt.y + point.y >> 1);
                var strokeSize = (skritter.fn.isCordova()) ? 12 : skritter.fn.getPressurizedStrokeSize(point, oldPt);
                marker.graphics.clear()
                        .setStrokeStyle(strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .beginStroke(Canvas.strokeColor)
                        .moveTo(midPt.x, midPt.y)
                        .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
                shape.graphics
                        .setStrokeStyle(strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .beginStroke(Canvas.strokeColor)
                        .moveTo(midPt.x, midPt.y)
                        .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
                oldPt.x = point.x;
                oldPt.y = point.y;
                oldMidPt.x = midPt.x;
                oldMidPt.y = midPt.y;
                points.push(oldPt.clone());
                stage.update();
            }
            function up(event) {
                var x = event.rawX;
                var y = event.rawY;
                if (x >= 0 && x < Canvas.size && y >= 0 && y < Canvas.size) {
                    Canvas.this.triggerInputUp(points, shape.clone(true));
                } else {
                    Canvas.this.fadeShape('background', shape.clone(true));
                }
                stage.removeEventListener('stagemousemove', move);
                stage.removeEventListener('stagemouseup', up);
                shape.graphics.clear();
                marker.graphics.clear();
                stage.clear();
                stage.update();
            }
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
         * @method fadeShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Function} callback
         * @returns {Container}
         */
        fadeShape: function(layerName, shape, callback) {
            var layer = this.getLayer(layerName);
            layer.addChild(shape);
            shape.cache(0, 0, Canvas.size, Canvas.size);
            createjs.Tween.get(shape).to({alpha: 0}, 300, createjs.Ease.linear).call(function(event) {
                event.target.uncache();
                layer.removeChild(event.target);
                if (typeof callback === 'function')
                    callback();
            });
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
         * @method hideMessage
         */
        hideMessage: function() {
            var layer = this.getLayer('feedback');
            for (var i in layer.children)
                createjs.Tween.get(layer.children[i]).to({y: -30}, 1000, createjs.Ease.bounceOut).call(hideChild);
            function hideChild() {
                layer.removeChild(layer.children[i]);
            }
        },
        /**
         * @method injectLayer
         * @param {String} layerName
         * @param {String} color
         * @returns {CreateJS.Container}
         */
        injectLayer: function(layerName, color) {
            var layer = this.getLayer(layerName);
            var inject = function() {
                if (color)
                    this.fillStyle = color;
            };
            for (var a in layer.children) {
                var child = layer.children[a];
                if (child.children && child.children.length > 0) {
                    for (var b in child.children)
                        if (!child.children[b].children)
                            child.children[b].graphics.inject(inject);
                } else if (!child.children) {
                    child.graphics.inject(inject);
                }
            }
            return layer;
        },
        /**
         * @method resize
         * @param {Object} event
         */
        resize: function(event) {
            Canvas.size = event.canvas;
            Canvas.element.width = Canvas.size;
            Canvas.element.height = Canvas.size;
            Canvas.touchElement.width = Canvas.size;
            Canvas.touchElement.height = Canvas.size;
            Canvas.this.drawGrid('grid');
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
            layer.cache(0, 0, Canvas.size, Canvas.size);
            return layer;
        },
        /**
         * @method showMessage
         * @param {String} text
         * @param {Boolean} autoHide
         * @param {Function} callback
         * @returns {Backbone.View}
         */
        showMessage: function(text, autoHide, callback) {
            var self = this;
            var layer = this.getLayer('feedback');
            var message = new createjs.Container();
            var box = new createjs.Shape(new createjs.Graphics().beginFill('grey').drawRect(0, 0, Canvas.size, 30));
            var line = new createjs.Shape(new createjs.Graphics().beginStroke('black').moveTo(0, 30).lineTo(Canvas.size, 30));
            message.name = 'message';
            message.y = -30;
            message.addChild(box);
            message.addChild(line);
            text = new createjs.Text(text, '20px Arial', '#ffffff');
            text.x = (Canvas.size / 2) - (text.getMeasuredWidth() / 2);
            text.y = 2.5;
            message.addChild(text);
            createjs.Tween.get(message).to({y: 0}, 500, createjs.Ease.sineOut).wait(2000).call(function() {
                if (autoHide)
                    self.hideMessage();
                if (typeof callback === 'function')
                    callback();
            });
            layer.addChild(message);
            return this;
        },
        /**
         * @method stage
         * @returns {CreateJS.Stage}
         */
        stage: function() {
            return Canvas.stage;
        },
        /**
         * Enables the view to fire events when the canvas has been touched.
         * 
         * @method triggerInputDown
         * @param {Object} point
         */
        triggerInputDown: function(point) {
            this.trigger('input:down', point);
        },
        /**
         * Enables the view to fire events when the canvas touch has been released.
         * 
         * @method triggerInputUp
         * @param {Array} points
         * @param {CreateJS.Shape} shape
         */
        triggerInputUp: function(points, shape) {
            this.trigger('input:up', points, shape);
        },
        /**
         * @method tweenShape
         * @param {String} layerName
         * @param {CreateJS.Shape} fromShape
         * @param {CreateJS.Shape} toShape
         * @param {Number} duration
         * @param {Function} callback
         * @returns {CreateJS.Shape}
         */
        tweenShape: function(layerName, fromShape, toShape, duration, callback) {
            duration = (duration) ? duration : 500;
            var layer = this.getLayer(layerName);
            layer.addChildAt(fromShape, 0);
            createjs.Tween.get(fromShape).to({
                x: toShape.x,
                y: toShape.y,
                scaleX: toShape.scaleX,
                scaleY: toShape.scaleY,
                rotation: toShape.rotation
            }, duration, createjs.Ease.backOut).call(function() {
                if (typeof callback === 'function')
                    callback();
            });
            return fromShape;
        },
        /**
         * @method uncacheLayer
         * @param {String} layerName
         * @returns {CreateJS.Container}
         */
        uncacheLayer: function(layerName) {
            var layer = this.getLayer(layerName);
            if (layer.cacheCanvas)
                layer.uncache();
            return layer;
        }
    });

    return Canvas;
});
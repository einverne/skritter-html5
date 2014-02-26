/**
 * @module Skritter
 * @submodule Views
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class PromptCanvas
     */
    var Canvas = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Canvas.this = this;
            Canvas.stage = {};
            Canvas.size = 400;
            Canvas.strokeSize = 12;
            Canvas.strokeCapStyle = 'round';
            Canvas.strokeColor = '#000000';
            Canvas.strokeJointStyle = 'round';

            Canvas.container = this.createCanvasContainer();
            Canvas.stage.display = this.createDisplayStage();
            Canvas.stage.input = this.createInputStage();
            createjs.Ticker.addEventListener('tick', Canvas.stage.display);
            createjs.Touch.enable(Canvas.stage.input);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(Canvas.container);
            this.$(Canvas.container).append(Canvas.stage.display.canvas);
            this.$(Canvas.container).append(Canvas.stage.input.canvas);
            this.createLayer('background');
            this.enableInput();
            return this;
        },
        /**
         * @method createDisplayCanvas
         * @returns {CreateJS.Stage}
         */
        createDisplayStage: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-display';
            element.width = Canvas.size;
            element.height = Canvas.size;
            var stage = new createjs.Stage(element);
            stage.autoClear = true;
            stage.enableDOMEvents(false);
            return stage;
        },
        /**
         * @method createCanvasContainer
         * @returns {DOMElement}
         */
        createCanvasContainer: function() {
            var element = document.createElement('div');
            element.className = 'canvas-container';
            element.style.width = Canvas.size + 'px';
            element.style.height = Canvas.size + 'px';
            return element;
        },
        /**
         * @method createInputStage
         * @returns {CreateJS.Stage}
         */
        createInputStage: function() {
            var element = document.createElement('canvas');
            element.id = 'canvas-input';
            element.width = Canvas.size;
            element.height = Canvas.size;
            var stage = new createjs.Stage(element);
            stage.autoClear = false;
            stage.enableDOMEvents(true);
            return stage;
        },
        /**
         * @method createLayer
         * @param {String} name
         * @returns {Container}
         */
        createLayer: function(name) {
            var layer = new createjs.Container();
            layer.name = 'layer-' + name;
            Canvas.stage.display.addChild(layer);
            return layer;
        },
        /**
         * @method disableInput
         */
        disableInput: function() {
            Canvas.stage.input.removeAllEventListeners();
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
            Canvas.stage.display.update();
            return this;
        },
        /**
         * @method enableInput
         */
        enableInput: function() {
            var stage = Canvas.stage.input;
            var oldPoint, oldMidPoint, points, marker, squig;
            if (!stage.hasEventListener('stagemousedown'))
                stage.addEventListener('stagemousedown', down);
            function down() {
                points = [];
                marker = new createjs.Shape();
                squig = new createjs.Shape();
                stage.addChild(marker);
                oldPoint = oldMidPoint = new createjs.Point(stage.mouseX, stage.mouseY);
                stage.addEventListener('stagemousemove', move);
                stage.addEventListener('stagemouseup', up);
            }
            function move() {
                var point = new createjs.Point(stage.mouseX, stage.mouseY);
                var midPoint = new createjs.Point(oldPoint.x + point.x >> 1, oldPoint.y + point.y >> 1);
                marker.graphics.clear()
                        .setStrokeStyle(Canvas.strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .beginStroke(Canvas.strokeColor)
                        .moveTo(midPoint.x, midPoint.y)
                        .curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                squig.graphics
                        .setStrokeStyle(Canvas.strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .beginStroke(Canvas.strokeColor)
                        .moveTo(midPoint.x, midPoint.y)
                        .curveTo(oldPoint.x, oldPoint.y, oldMidPoint.x, oldMidPoint.y);
                oldPoint = point;
                oldMidPoint = midPoint;
                points.push(point.clone());
                stage.update();
            }
            function up(event) {
                stage.removeEventListener('stagemousemove', move);
                stage.removeEventListener('stagemouseup', up);
                if (event.rawX >= 0 && event.rawX < Canvas.size && event.rawY >= 0 && event.rawY < Canvas.size)
                    Canvas.this.triggerInputUp(points, squig);
                Canvas.this.fadeShape('background', squig);
                marker.graphics.clear();
                stage.clear();
            }
        },
        /**
         * @method fadeShape
         * @param {String} layerName
         * @param {CreateJS.Shape} shape
         * @param {Function} callback
         */
        fadeShape: function(layerName, shape, callback) {
            var layer = this.getLayer(layerName);
            layer.addChild(shape);
            Canvas.stage.display.update();
            shape.cache(0, 0, Canvas.size, Canvas.size);
            createjs.Tween.get(shape).to({alpha: 0}, 300, createjs.Ease.backOut).call(function() {
                shape.uncache();
                layer.removeChild(shape);
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method getLayer
         * @param {String} name
         * @returns {CreateJS.Container}
         */
        getLayer: function(name) {
            return Canvas.stage.display.getChildByName('layer-' + name);
        },
        /**
         * @method size
         * @param {Number} size
         */
        size: function(size) {
            Canvas.container.style.width = size + 'px';
            Canvas.container.style.height = size + 'px';
            Canvas.stage.display.canvas.width = size;
            Canvas.stage.display.canvas.height = size;
            Canvas.stage.input.canvas.width = size;
            Canvas.stage.input.canvas.height = size;
            Canvas.size = size;
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
        }
    });

    return Canvas;
});
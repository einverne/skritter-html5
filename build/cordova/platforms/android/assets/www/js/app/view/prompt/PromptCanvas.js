/**
 * @module Skritter
 * @submodule Prompt
 * @param templateCanvas
 * @author Joshua McFarland
 */
define([
    'require.text!template/prompt-canvas.html',
    'backbone',
    'createjs.easel',
    'createjs.tween'
], function(templateCanvas) {
    /**
     * @class PromptCanvas
     */
    var Canvas = Backbone.View.extend({
        initialize: function() {
            Canvas.d = null;
            Canvas.i = null;
            Canvas.points = [];
            Canvas.size = Skritter.settings.get('canvasSize');
            Canvas.strokeColor = '#000000';
            Canvas.strokeSize = 12;
            Canvas.strokeCapStyle = 'round';
            Canvas.strokeJointStyle = 'round';
            createjs.Ticker.addEventListener('tick', this.tick);
        },
        /**
         * @method render
         * @returns {Canvas}
         */
        render: function() {
            this.$el.html(templateCanvas);
            //todo: check to see if this really effects anything when hwa is enabled
            //$("#input-canvas").parents("*").css("overflow", "visible");
            this.resize();
            this.initStages();
            this.initLayers();
            this.drawGrid();
            return this;
        },
        /**
         * @method initLayers
         * @returns {Canvas}
         */
        initLayers: function() {
            Canvas.layerGrid = new createjs.Container();
            Canvas.layerGrid.name = 'layerGrid';
            Canvas.layerBackground = new createjs.Container();
            Canvas.layerBackground.name = 'layerBackground';
            Canvas.layerInput = new createjs.Container();
            Canvas.layerInput.name = 'layerInput';
            Canvas.layerMessage = new createjs.Container();
            Canvas.layerMessage.name = 'layerMessage';
            Canvas.layerOverlay = new createjs.Container();
            Canvas.layerOverlay.name = 'layerOverlay';
            Canvas.d.addChild(Canvas.layerGrid);
            Canvas.d.addChild(Canvas.layerBackground);
            Canvas.d.addChild(Canvas.layerInput);
            Canvas.d.addChild(Canvas.layerMessage);
            Canvas.d.addChild(Canvas.layerOverlay);
            return this;
        },
        /**
         * @method initStages
         * @returns {Canvas}
         */
        initStages: function() {
            Canvas.d = new createjs.Stage(document.getElementById('display-canvas'));
            Canvas.d.enableDOMEvents(false);
            Canvas.d.autoClear = true;
            Canvas.i = new createjs.Stage(document.getElementById('input-canvas'));
            Canvas.i.enableDOMEvents(true);
            createjs.Touch.enable(Canvas.i);
            Canvas.i.autoClear = false;
            return this;
        },
        clear: function() {
            Canvas.d.removeAllChildren();
            this.initLayers();
            this.drawGrid();
        },
        /**
         * An ugly yet needed feature to force certain Cordova wrapped Android devices to clear
         * the canvas and render.
         * 
         * @method clearFix
         */
        clearFix: function() {
            if (Skritter.fn.isCordova()) {
                this.$('#canvas-container').css('opacity', 0.99);
                window.setTimeout(function() {
                    this.$('#canvas-container').css('opacity', 1);
                }, 0);
            }
        },
        /**
         * Disables all touch input on the canvas. This is most commonly used when a user has
         * already completed a problem and it needs grading.
         * 
         * @method disableInput
         */
        disableInput: function() {
            Canvas.i.removeAllEventListeners();
        },
        /**
         * @method displayMessage
         * @param {String} message
         * @param {String} color
         * @param {String} font
         */
        displayMessage: function(message, color, font) {
	    Canvas.layerMessage.removeAllChildren();
	    var text = new createjs.Text(message, font, color);
	    text.x = (Canvas.size / 2) - (text.getMeasuredWidth() / 2);
	    text.y = Canvas.size * 0.9;
	    createjs.Tween.get(text).wait(2000).to({ alpha:0 }, 500).call(function() {
		Canvas.layerMessage.removeChild(text);
	    });
	    Canvas.layerMessage.addChild(text);
	},
        /**
         * Given a CanvasCharacter this will render the image to the canvas.
         * 
         * @param {CanvasCharacter} canvasCharacter
         * @param {Number} alpha
         */
        drawCharacter: function(canvasCharacter, alpha) {
            var characterBitmap = canvasCharacter.getCharacterBitmap();
            if (alpha)
                characterBitmap.alpha = alpha;
            Canvas.layerOverlay.addChild(characterBitmap);
            Canvas.d.update();
        },
        /**
         * The grid that fills the background of the canvas for rune prompts.
         * 
         * @method drawGrid
         */
        drawGrid: function() {
            var grid = new createjs.Shape();
            grid.graphics.beginStroke('grey').setStrokeStyle(1, Canvas.strokeCapStyle, Canvas.strokeJointStyle);
            grid.graphics.moveTo(Canvas.size / 2, 0).lineTo(Canvas.size / 2, Canvas.size);
            grid.graphics.moveTo(0, Canvas.size / 2).lineTo(Canvas.size, Canvas.size / 2);
            grid.graphics.moveTo(0, 0).lineTo(Canvas.size, Canvas.size);
            grid.graphics.moveTo(Canvas.size, 0).lineTo(0, Canvas.size);
            grid.graphics.endStroke();
            Canvas.layerGrid.addChild(grid);
            this.clearFix();
        },
        drawPhantomStroke: function(canvasStroke, callback) {
            var userStroke = canvasStroke.getInflatedBitmap(true);
            Canvas.layerInput.addChild(userStroke);
            createjs.Tween.get(userStroke).to({alpha: 0}, 500).call(function() {
                Canvas.layerInput.removeChild(userStroke);
                if (typeof callback === 'function')
                    callback();
            });
        },
        drawSquig: function(canvasStroke, alpha) {
            var marker = new createjs.Shape();
            var stroke = canvasStroke;
            var points = stroke.get('points');
            var prevPoint = points[0];
            var prevMidPoint = points[0];
            marker.graphics.setStrokeStyle(14, 'round', 'round').beginStroke('orange');
            for (var p in points)
            {
                var midPoint = new createjs.Point(prevPoint.x + points[p].x >> 1, prevPoint.y + points[p].y >> 1);
                marker.graphics.moveTo(midPoint.x, midPoint.y).curveTo(prevPoint.x, prevPoint.y, prevMidPoint.x, prevMidPoint.y);
                prevPoint = points[p];
                prevMidPoint = midPoint;
            }
            if (alpha)
                marker.alpha = alpha;
            marker.graphics.endStroke();
            Canvas.layerInput.addChild(marker);
            Canvas.d.update();
        },
        drawStroke: function(canvasStroke, callback) {
            var self = this;
            var strokeBitmap = canvasStroke.getUserBitmap(false);
            createjs.Tween.get(strokeBitmap).to(canvasStroke.getInflatedBitmap(), 250, createjs.Ease.quadInOut).call(function() {
                self.clearFix();
                if (typeof callback === 'function')
                    callback();
            });
            Canvas.layerInput.addChildAt(strokeBitmap, 0);
            Canvas.d.update();
            this.clearFix();
        },
        /**
         * Enables touch input and drawing on the canvas. It also handles the immediate ink
         * traced by the finger. It's important that this canvas doesn't use autoClear for
         * speed reasons and Cordova compatibility.
         * 
         * @method enableInput
         */
        enableInput: function() {
            var self = this;
            var oldPt, oldMidPt, points;
            var stage = Canvas.i;
            var marker = new createjs.Shape();
            stage.addChild(marker);
            var down = function() {
                points = [];
                oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
                self.triggerMouseDown(oldPt);
                oldMidPt = oldPt;
                Canvas.points.push(oldPt.clone());
                stage.addEventListener('stagemousemove', move);
                stage.addEventListener('stagemouseup', up);
            };
            var move = function() {
                var point = new createjs.Point(stage.mouseX, stage.mouseY);
                var midPt = new createjs.Point(oldPt.x + point.x >> 1, oldPt.y + point.y >> 1);
                marker.graphics.clear()
                        .setStrokeStyle(Canvas.strokeSize, Canvas.strokeCapStyle, Canvas.strokeJointStyle)
                        .beginStroke(Canvas.strokeColor)
                        .moveTo(midPt.x, midPt.y)
                        .curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
                oldPt.x = point.x;
                oldPt.y = point.y;
                oldMidPt.x = midPt.x;
                oldMidPt.y = midPt.y;
                points.push(oldPt.clone());
                stage.update();
                self.clearFix();
            };
            var up = function up(event) {
                if (isOnCanvas(event)) {
                    self.triggerMouseUp(points);
                }
                stage.removeEventListener('stagemousemove', move);
                stage.removeEventListener('stagemouseup', up);
                stage.clear();
            };
            var isOnCanvas = function(event) {
                var x = event.rawX;
                var y = event.rawY;
                if (x >= 0 && x < Canvas.size && y >= 0 && y < Canvas.size)
                    return true;
            };
            stage.addEventListener('stagemousedown', down);
        },
        /**
         * @method glowCharacter
         * @param {CanvasCharacter} character
         * @param {String} color
         */
        glowCharacter: function(character, color) {
	    var bitmap = character.getCharacterBitmap();
	    bitmap.alpha = 0.4;
	    bitmap.shadow = new createjs.Shadow(color, 5, 5, 0);
	    createjs.Tween.get(bitmap, {loop: true}).to({alpha: 0.7}, 1500).wait(1000).to({alpha:0.4}, 1500).wait(1000);
	    Canvas.layerInput.addChildAt(bitmap, 0);
	},
        /**
         * @method resize
         */
        resize: function() {
            var container = document.getElementById('canvas-container');
            var d = document.getElementById('display-canvas');
            var i = document.getElementById('input-canvas');
            container.setAttribute('width', Canvas.size);
            container.setAttribute('height', Canvas.size);
            d.setAttribute('width', Canvas.size);
            d.setAttribute('height', Canvas.size);
            i.setAttribute('width', Canvas.size);
            i.setAttribute('height', Canvas.size);
        },
        /**
         * @method tick
         */
        tick: function() {
            Canvas.d.update();
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
/**
 * @module Skritter
 * @submodule Prompt
 * @author Joshua McFarland
 */
define([
    'backbone',
    'createjs.easel',
    'createjs.tween'
], function() {
    /**
     * @class PromptCanvas
     */
    var Canvas = Backbone.View.extend({
        initialize: function() {
            Canvas.canvas = null;
            Canvas.stage = null;
            Canvas.points = [];
            Canvas.size = Skritter.settings.get('canvasSize');
            Canvas.strokeColor = '#000000';
            Canvas.strokeSize = 12;
            Canvas.strokeCapStyle = 'round';
            Canvas.strokeJointStyle = 'round';
            this.initStage();
        },
        /**
         * @method render
         * @returns {Canvas}
         */
        render: function() {
            this.$el.append(Canvas.canvas);
            this.resize();
            this.initLayers();
            this.drawGrid();
            return this;
        },
        /**
         * Creates several containers used to organize different levels of display.
         * 
         * @method initLayers
         * @returns {Canvas}
         */
        initLayers: function() {
            //the bottom layer which contains the eight section grid
            Canvas.layerGrid = new createjs.Container();
            Canvas.layerGrid.name = 'layerGrid';
            Canvas.stage.addChild(Canvas.layerGrid);
            //phantoms and hints use this layer
            Canvas.layerBackground = new createjs.Container();
            Canvas.layerBackground.name = 'layerBackground';
            Canvas.stage.addChild(Canvas.layerBackground);
            //contains all of the messages displayed for the user
            Canvas.layerMessage = new createjs.Container();
            Canvas.layerMessage.name = 'layerMessage';
            Canvas.stage.addChild(Canvas.layerMessage);
            //not sure why I have this container
            Canvas.layerOverlay = new createjs.Container();
            Canvas.layerOverlay.name = 'layerOverlay';
            Canvas.stage.addChild(Canvas.layerOverlay);
            //top layer which shows the touch drawing
            Canvas.layerInput = new createjs.Container();
            Canvas.layerInput.name = 'layerInput';
            Canvas.stage.addChild(Canvas.layerInput);
            return this;
        },
        /**
         * @method initStage
         * @returns {Canvas}
         */
        initStage: function() {
            Canvas.canvas = document.createElement('canvas');
	    Canvas.canvas.setAttribute('id', 'prompt-canvas');
	    Canvas.canvas.setAttribute('width', Canvas.size);
	    Canvas.canvas.setAttribute('height', Canvas.size);
	    Canvas.canvas.setAttribute('style', 'background:white');
            Canvas.stage = new createjs.Stage(Canvas.canvas);
            Canvas.stage.enableDOMEvents(true);
            Canvas.stage.autoClear = true;
            createjs.Touch.enable(Canvas.stage);
            createjs.Ticker.addEventListener('tick', this.tick);
            return this;
        },
        clear: function() {
            Canvas.layerBackground.removeAllChildren();
            Canvas.layerMessage.removeAllChildren();
            Canvas.layerOverlay.removeAllChildren();
            Canvas.layerInput.removeAllChildren();
            Canvas.stage.update();
            this.clearFix();
        },
        /**
         * An ugly yet needed feature to force certain Cordova wrapped Android devices to clear
         * the canvas and render.
         * 
         * @method clearFix
         */
        clearFix: function() {
            if (Skritter.fn.isCordova()) {
                this.$('#prompt-canvas').css('opacity', 0.99);
                window.setTimeout(function() {
                    this.$('#prompt-canvas').css('opacity', 1);
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
            Canvas.stage.removeAllEventListeners();
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
            Canvas.layerBackground.addChild(characterBitmap);
            Canvas.stage.update();
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
        },
        /**
         * @method drawPhantomStroke
         * @param {CanvasStroke} canvasStroke
         * @param {Function} callback
         */
        drawPhantomStroke: function(canvasStroke, callback) {
            var userStroke = canvasStroke.getInflatedBitmap(true);
            Canvas.layerOverlay.addChild(userStroke);
            createjs.Tween.get(userStroke).to({alpha: 0}, 500).call(function() {
                Canvas.layerOverlay.removeChild(userStroke);
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method drawSquig
         * @param {CanvasStroke} canvasStroke
         * @param {Number} alpha
         */
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
            Canvas.layerBackground.addChild(marker);
            Canvas.stage.update();
        },
        /**
         * @method drawStroke
         * @param {CanvasStroke} canvasStroke
         * @param {Function} callback
         */
        drawStroke: function(canvasStroke, callback) {
            var strokeBitmap = canvasStroke.getUserBitmap();
            Canvas.layerBackground.addChildAt(strokeBitmap, 0);
            createjs.Tween.get(strokeBitmap).to(canvasStroke.getInflatedBitmap(), 500, createjs.Ease.backOut).call(function() {
                if (typeof callback === 'function')
                    callback();
            });
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
            var stage = Canvas.stage;
            var marker = new createjs.Shape();
            Canvas.layerInput.addChild(marker);
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
                marker.graphics
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
            };
            var up = function up(event) {
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
            stage.addEventListener('stagemousedown', down);
        },
        /**
         * @method fadeOverlay
         */
        fadeOverlay: function() {
	    if (Canvas.layerOverlay.getNumChildren() > 0) {
		createjs.Tween.get(Canvas.layerOverlay).to({alpha: 0}, 500).call(function() {
		    Canvas.layerOverlay.removeAllChildren();
		    Canvas.layerOverlay.alpha = 1.0;
		});
	    }
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
	    Canvas.layerBackground.addChildAt(bitmap, 0);
	},
        /**
         * @method resize
         */
        resize: function() {
            Canvas.canvas.setAttribute('width', Canvas.size);
            Canvas.canvas.setAttribute('height', Canvas.size);
            $('#canvas-container').width(Canvas.size);
            $('#canvas-container').height(Canvas.size);
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
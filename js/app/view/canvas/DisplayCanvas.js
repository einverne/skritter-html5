/*
 * 
 * View: DisplayCanvas
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'createjs.easel',
    'createjs.tween',
    'backbone'
], function() {
    
    var DisplayCanvas = Backbone.View.extend({
	
	initialize: function() {
	    //variables and settings
	    DisplayCanvas.size = Skritter.settings.get('canvasSize');
	    
	    //create the canvas element
	    DisplayCanvas.canvas = document.createElement('canvas');
	    DisplayCanvas.canvas.setAttribute('id', 'display-canvas');
	    DisplayCanvas.canvas.setAttribute('width', DisplayCanvas.size);
	    DisplayCanvas.canvas.setAttribute('height', DisplayCanvas.size);
	    DisplayCanvas.canvas.setAttribute('style', 'background:white');
	    
	    //binds easeljs stage to the element
	    DisplayCanvas.stage = new createjs.Stage(DisplayCanvas.canvas);
	    DisplayCanvas.stage.autoClear = true;
	    DisplayCanvas.stage.enableDOMEvents(false);
	    createjs.Ticker.addEventListener('tick', this.tick);
	    
	    //containers and layers
	    DisplayCanvas.layerGrid = new createjs.Container();
	    DisplayCanvas.layerGrid.name = 'layerGrid';
	    DisplayCanvas.layerBackground = new createjs.Container();
	    DisplayCanvas.layerBackground.name = 'layerBackground';
	    DisplayCanvas.layerInput = new createjs.Container();
	    DisplayCanvas.layerInput.name = 'layerInput';
	    DisplayCanvas.layerMessage = new createjs.Container();
	    DisplayCanvas.layerMessage.name = 'layerMessage';
	    DisplayCanvas.layerOverlay = new createjs.Container();
	    DisplayCanvas.layerOverlay.name = 'layerOverlay';
	    DisplayCanvas.stage.addChild(DisplayCanvas.layerGrid);
	    DisplayCanvas.stage.addChild(DisplayCanvas.layerBackground);
	    DisplayCanvas.stage.addChild(DisplayCanvas.layerInput);
	    DisplayCanvas.stage.addChild(DisplayCanvas.layerMessage);
	    DisplayCanvas.stage.addChild(DisplayCanvas.layerOverlay);
	    
	    //creates a shape used for drawing
	    DisplayCanvas.marker = new createjs.Shape();
	    DisplayCanvas.layerInput.addChild(DisplayCanvas.marker);
	},
	
	render: function() {
	    this.$el.append(DisplayCanvas.canvas);
	    return this;
	},
		
	forceRender: function() {
	    //quick ugly fix for some rendering issues
	    $(DisplayCanvas.canvas).css('display', 'block');
	    setTimeout(function() {
		$(DisplayCanvas.canvas).css('display', 'inline-block');
	    }, 0);
	},
		
	clear: function() {
	    DisplayCanvas.layerBackground.removeAllChildren();
	    DisplayCanvas.layerInput.removeAllChildren();
	    DisplayCanvas.layerMessage.removeAllChildren();
	    DisplayCanvas.layerOverlay.removeAllChildren();
	},
		
	displayMessage: function(message, color, font) {
	    DisplayCanvas.layerMessage.removeAllChildren();
	    var text = new createjs.Text(message, font, color);
	    text.x = (DisplayCanvas.size / 2) - (text.getMeasuredWidth() / 2);
	    text.y = DisplayCanvas.size * 0.9;
	    createjs.Tween.get(text).wait(2000).to({ alpha:0 }, 500).call(function() {
		DisplayCanvas.layerMessage.removeChild(text);
	    });
	    DisplayCanvas.layerMessage.addChild(text);
	},
		
	drawCharacter: function(canvasCharacter, alpha) {
	    var characterBitmap = canvasCharacter.getCharacterBitmap();
	    if (alpha)
		characterBitmap.alpha = alpha;
	    DisplayCanvas.layerOverlay.addChild(characterBitmap);
	},
		
	drawGrid: function() {
	    var grid = new createjs.Shape();
	    grid.graphics.beginStroke('grey');
	    grid.graphics.moveTo(DisplayCanvas.size / 2, 0).lineTo(DisplayCanvas.size / 2, DisplayCanvas.size);
	    grid.graphics.moveTo(0, DisplayCanvas.size / 2).lineTo(DisplayCanvas.size, DisplayCanvas.size / 2);
	    grid.graphics.moveTo(0, 0).lineTo(DisplayCanvas.size, DisplayCanvas.size);
	    grid.graphics.moveTo(DisplayCanvas.size, 0).lineTo(0, DisplayCanvas.size);
	    grid.graphics.endStroke();
	    DisplayCanvas.layerGrid.addChild(grid);
	},
	
	drawPoints: function(points) {
	    if (!points instanceof Array)
		points = [points];
	    for (var i in points)
	    {
		var point = points[i];
		var circle = new createjs.Shape();
		circle.graphics.beginFill('orange').drawCircle(point.x, point.y, 10);
		DisplayCanvas.layerOverlay.addChild(circle);
	    }
	},
		
	drawSquig: function(canvasStroke) {
	    var stroke = canvasStroke;
	    var points = stroke.get('points');
	    var prevPoint = points[0];
	    var prevMidPoint = points[0];
	    DisplayCanvas.marker.graphics.setStrokeStyle(14, 'round', 'round').beginStroke('orange');
	    for (var p in points)
	    {
		var midPoint = new createjs.Point(prevPoint.x + points[p].x >> 1, prevPoint.y + points[p].y >> 1);
		DisplayCanvas.marker.graphics.moveTo(midPoint.x, midPoint.y).curveTo(prevPoint.x, prevPoint.y, prevMidPoint.x, prevMidPoint.y);
		prevPoint = points[p];
		prevMidPoint = midPoint;
	    }
	    DisplayCanvas.marker.graphics.endStroke();
	},
		
	drawStroke: function(canvasStroke, phantom, callback) {
	    if (canvasStroke.get('part') === 'tone' || phantom) {
		var userBitmap = canvasStroke.getInflatedBitmap();
		DisplayCanvas.layerInput.addChild(userBitmap);
		if (phantom) {
		    createjs.Tween.get(userBitmap).to({alpha: 0}, 500).call(function() {
			DisplayCanvas.layerInput.removeChild(userBitmap);
		    });
		} else {
		    callback();
		}
	    } else {
		var userBitmap = canvasStroke.getUserBitmap();
		DisplayCanvas.layerInput.addChildAt(userBitmap, 0);
		createjs.Tween.get(userBitmap).to(canvasStroke.getInflatedBitmap(), 250, createjs.Ease.quadInOut).call(callback);
	    }
	},
		
	drawText: function(text, x, y, color, alpha, font) {
	    var t = new createjs.Text(text, font, color);
	    t.x = x;
	    t.y = y;
	    t.alpha = alpha;
	    DisplayCanvas.layerOverlay.addChild(t);
	},
		
	fadeOverlay: function() {
	    if (DisplayCanvas.layerOverlay.getNumChildren() > 0) {
		createjs.Tween.get(DisplayCanvas.layerOverlay).to({alpha: 0}, 500).call(function() {
		    DisplayCanvas.layerOverlay.removeAllChildren();
		    DisplayCanvas.layerOverlay.alpha = 1.0;
		});
	    }
	},
		
	filterLayerColor: function(layerName, filter) {
	    var layer = DisplayCanvas.stage.getChildByName(layerName);
	    layer.filters = filter;
	    layer.cache(0, 0, DisplayCanvas.size, DisplayCanvas.size);
	    layer.updateCache();
	},
		
	glowCharacter: function(character, color) {
	    var bitmap = character.getCharacterBitmap();
	    bitmap.alpha = 0.4;
	    bitmap.shadow = new createjs.Shadow(color, 5, 5, 10);
	    createjs.Tween.get(bitmap, {loop: true}).to({alpha: 0.7}, 1500).wait(1000).to({alpha:0.4}, 1500).wait(1000);
	    DisplayCanvas.layerInput.addChildAt(bitmap, 0);
	},
		
	tick: function() {
	    DisplayCanvas.stage.update();
	},
		
	update: function() {
	    DisplayCanvas.stage.update();
	}
	
    });
    
    
    return DisplayCanvas;
});
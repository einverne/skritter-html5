/*
 * 
 * View: Canvas
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Recognizer',
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'createjs.easel',
    'createjs.tween',
    'createjs.filter.color',
    'backbone'
], function(Recognizer, CanvasCharacter, CanvasStroke) {
    var Skritter = window.skritter;

    var CanvasView = Backbone.View.extend({
	
	initialize: function() {
	    //settings
	    CanvasView.recognizer = (this.options.recognizer !== undefined) ? this.options.recognizer : true;
	    
	    //attributes
	    CanvasView.width = Skritter.settings.get('canvasWidth');
	    CanvasView.height = Skritter.settings.get('canvasHeight');
	    CanvasView.userFailedAttempts = 0;
	    CanvasView.userGrade = 3;
	    CanvasView.userTargets = null;
	    CanvasView.userCharacter = null;
	    CanvasView.userStroke = null;
	    
	    //create the canvas elements
	    CanvasView.canvas = document.createElement('canvas');
	    CanvasView.canvas.setAttribute('id', 'canvas');
	    CanvasView.canvas.setAttribute('width', CanvasView.width);
	    CanvasView.canvas.setAttribute('height', CanvasView.height);
	    
	    //binds the stages to the canvas
	    CanvasView.stage = new createjs.Stage(CanvasView.canvas);	   
	    createjs.Ticker.addEventListener('tick', this.tick);
	    createjs.Touch.enable(CanvasView.stage);
	    
	    //creates the layers used by the stage
	    CanvasView.layerGrid = new createjs.Container();
	    CanvasView.layerHighlight = new createjs.Container();
	    CanvasView.layerBackground = new createjs.Container();
	    CanvasView.layerMessage = new createjs.Container();
	    CanvasView.layerInput = new createjs.Container();
	    CanvasView.layerOverlay = new createjs.Container();
	    CanvasView.stage.addChild(CanvasView.layerGrid);
	    CanvasView.stage.addChild(CanvasView.layerHighlight);
	    CanvasView.stage.addChild(CanvasView.layerBackground);
	    CanvasView.stage.addChild(CanvasView.layerMessage);
	    CanvasView.stage.addChild(CanvasView.layerInput);
	    CanvasView.stage.addChild(CanvasView.layerOverlay);
	    
	    //used for drawing to the canvas
	    CanvasView.inputMarker = new createjs.Shape();
	    CanvasView.layerInput.addChild(CanvasView.inputMarker);
	},
		
	render: function() {
	    this.$el.html(CanvasView.canvas);
	    
	    this.drawGrid();
	    this.enable();
	    
	    return this;
	},
		
	clearAll: function(resetData) {
	    if (resetData) {
		CanvasView.userCharacter = new CanvasCharacter();
		CanvasView.userStroke = new CanvasStroke();
		CanvasView.consecutiveFailedAttempts = 0;
	    }
	    CanvasView.inputMarker.graphics.clear();
	    CanvasView.layerBackground.removeAllChildren();
	    CanvasView.layerHighlight.removeAllChildren();
	    CanvasView.layerOverlay.removeAllChildren();
	},
		
	disable: function() {
	    CanvasView.stage.removeAllEventListeners();
	},
		
	drawBackground: function(character, alpha) {
	    if (CanvasView.layerBackground.children.length > 0)
		return;
	    
	    if (alpha) {
		character.cache(0, 0, CanvasView.width, CanvasView.height);
		character.alpha = alpha;
		character.updateCache();
	    }
	    CanvasView.layerBackground.addChild(character);
	    CanvasView.stage.update();
	},
		
	drawGrid: function() {
	    var grid = new createjs.Shape();
	    grid.graphics.beginStroke(Skritter.settings.get('canvasGridColor'))
		    .moveTo(CanvasView.width / 2, 0).lineTo(CanvasView.width / 2, CanvasView.height)
		    .moveTo(0, CanvasView.height / 2).lineTo(CanvasView.width, CanvasView.height / 2)
		    .moveTo(0, 0).lineTo(CanvasView.width, CanvasView.height)
		    .moveTo(CanvasView.width, 0).lineTo(0, CanvasView.height)
		    .endStroke();
	    CanvasView.layerGrid.addChild(grid);
	    CanvasView.stage.update();
	},
		
	drawRawStroke: function(bitmapId) {
	    var image = Skritter.assets.getItem('stroke', ''+bitmapId);
	    var bitmap = new createjs.Bitmap(image.src);
	    console.log(bitmap);
	    CanvasView.layerBackground.addChild(bitmap);
	},
		
	drawStroke: function(stroke) {
	    var bitmap = stroke.getBitmapContainer(true);
	    CanvasView.layerInput.addChild(bitmap);
	    this.handleStrokeComplete();
	},
		
	enable: function() {
	    CanvasView.stage.addEventListener('stagemousedown', handleMouseDown);
	    CanvasView.stage.addEventListener('stagemouseup', _.bind(handleMouseUp, this));

	    var points, prevPoint, prevMidPoint;
	    function handleMouseDown() {
		points = [];
		CanvasView.userStroke = new CanvasStroke();
		prevPoint = new createjs.Point(CanvasView.stage.mouseX, CanvasView.stage.mouseY);
		prevMidPoint = prevPoint;
		points.push(prevPoint.clone());
		CanvasView.inputMarker.graphics.setStrokeStyle(14, 'round', 'round').beginStroke('orange');
		CanvasView.stage.addEventListener('stagemousemove', handleMouseMove);
	    }
	    
	    function handleMouseMove() {
		var curPoint = new createjs.Point(CanvasView.stage.mouseX,CanvasView.stage.mouseY);
		var curMidPoint = new createjs.Point(prevPoint.x + curPoint.x >> 1, prevPoint.y + curPoint.y >> 1);
		CanvasView.inputMarker.graphics.moveTo(curMidPoint.x, curMidPoint.y).curveTo(prevPoint.x, prevPoint.y, prevMidPoint.x, prevMidPoint.y);
		prevPoint = curPoint;
		prevMidPoint = curMidPoint;
		points.push(prevPoint.clone());
		CanvasView.stage.update();
	    }
	    
	    function handleMouseUp(event) {
		if (isOnCanvas(event) && CanvasView.userStroke !== null && Skritter.fn.getLength(points) > 30) {
		    CanvasView.inputMarker.graphics.endStroke();
		    CanvasView.userStroke.set('points', points);
		    
		    if (CanvasView.recognizer) {
			var result = new Recognizer(CanvasView.userCharacter, CanvasView.userStroke, CanvasView.userTargets).recognize();
			if (result && !CanvasView.userCharacter.containsStroke(result)) {
			    CanvasView.userFailedAttempts = 0;
			} else {
			    CanvasView.userFailedAttempts++;
			    if (CanvasView.userFailedAttempts > 2) {
				CanvasView.userGrade = 1;
			    }
			    CanvasView.userStroke = null;
			}
		    } else {
			CanvasView.userCharacter = new CanvasCharacter();
			CanvasView.userStroke.set('visible', true);
		    }
		    
		    if (CanvasView.userStroke) {
			CanvasView.userCharacter.add(CanvasView.userStroke);
			this.drawStroke(result);
		    }
		    
		    this.redraw();
		}
		CanvasView.stage.removeEventListener('stagemousemove', handleMouseMove);
	    }
	    
	    function isOnCanvas(event) {
		var x = event.rawX;
		var y = event.rawY;
		if (x >= 0 && x < CanvasView.width && y >= 0 && y < CanvasView.height)
		    return true;
	    }
	},
	
	getCurrentStroke: function() {
	    return CanvasView.userStroke;
	},
		
	getTargetStrokeCount: function() {
	    var strokeCount = 0;
	    for (var a in CanvasView.userTargets)
	    {
		if (CanvasView.userTargets[a].getStrokeCount() > strokeCount) {
		    strokeCount = CanvasView.userTargets[a].getStrokeCount();
		}
	    }
	    return strokeCount-1;
	},
		
	handleStrokeComplete: function() {
	    this.triggerStrokeComplete();
	    if (this.isCharacterComplete()) {
		CanvasView.inputMarker.graphics.clear();
		if (CanvasView.userGrade === 3) {
		    this.highlight(CanvasView.layerHighlight, 'green');
		} else {
		    this.highlight(CanvasView.layerHighlight, 'red');
		}
		this.triggerCharacterComplete();
	    }
	},
		
	highlight: function(layer, color) {
	    var highlight = CanvasView.userTargets[0].getCharacterContainer();
	    highlight.alpha = 0.2;
	    highlight.shadow = new createjs.Shadow(color, 5, 5, 0);
	    createjs.Tween.get(highlight).to({alpha:0.5}, 2000).call(function() {
		createjs.Tween.get(highlight, {loop:true}).to({alpha:0.4}, 2000).wait(500).to({alpha:0.6}, 2000);
	    });
	    layer.addChild(highlight);
	},
		
	isCharacterComplete: function() {
	    //console.log('Position: ' + CanvasView.userCharacter.getStrokeCount() + '/' + this.getTargetStrokeCount());
	    if (CanvasView.userCharacter.getStrokeCount() > this.getTargetStrokeCount()) {
		return true;
	    }
	    return false;
	},
		
	tick: function() {
	    CanvasView.stage.update();
	},
		
	redraw: function() {
	    CanvasView.inputMarker.graphics.clear();
	    CanvasView.inputMarker.graphics.setStrokeStyle(14, 'round', 'round').beginStroke('orange');
	    for (var a in CanvasView.userCharacter.models) {
		var stroke = CanvasView.userCharacter.models[a];
		if (stroke.get('visible')) {
		    var points = stroke.get('points');
		    var prevPoint = points[0];
		    var prevMidPoint = points[0];
		    for (var b in points)
		    {
			var midPoint = new createjs.Point(prevPoint.x + points[b].x >> 1, prevPoint.y + points[b].y >> 1);
			CanvasView.inputMarker.graphics.moveTo(midPoint.x, midPoint.y).curveTo(prevPoint.x, prevPoint.y, prevMidPoint.x, prevMidPoint.y);
			prevPoint = points[b];
			prevMidPoint = midPoint;
		    }
		}
	    }
	    CanvasView.inputMarker.graphics.endStroke();
	},
	
		
	setTargets: function(canvasCharacters) {
	    CanvasView.correct = true;
	    CanvasView.userTargets = canvasCharacters;
	    CanvasView.userCharacter = new CanvasCharacter();
	},
		
	showTarget: function(alpha) {
	    //todo: clean up this method of checking for existing bitmaps
	    if (CanvasView.layerBackground.children.length > 0)
		return false;
	    if (!this.isCharacterComplete())
		CanvasView.correct = false;
	    var character = CanvasView.userTargets[0].getCharacterContainer();
	    if (alpha) {
		character.cache(0, 0, CanvasView.width, CanvasView.height);
		character.alpha = alpha;
		character.updateCache();
	    } 
	    CanvasView.layerBackground.addChild(character);
	    return true;
	},
		
	triggerCharacterComplete: function() {
	    this.trigger('complete:character', CanvasView.userGrade);
	},
		
	triggerStrokeComplete: function() {
	    this.trigger('complete:stroke');
	}
	
    });


    return CanvasView;
});
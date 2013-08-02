/*
 * 
 * Module: Canvas
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
	    //create the canvas element
	    CanvasView.width = (this.options.width) ? this.options.width : Skritter.settings.get('canvasWidth');
	    CanvasView.height = (this.options.height) ? this.options.height : Skritter.settings.get('canvasHeight');
	    CanvasView.canvas = document.createElement('canvas');
	    CanvasView.canvas.setAttribute('id', 'canvas-prompt');
	    CanvasView.canvas.setAttribute('width', CanvasView.width);
	    CanvasView.canvas.setAttribute('height', CanvasView.height);
	    CanvasView.canvas.setAttribute('background', Skritter.settings.get('canvasBackgroundColor'));
	    CanvasView.context = new createjs.Stage(CanvasView.canvas);
	    createjs.Touch.enable(CanvasView.context);
	    createjs.Ticker.addEventListener('tick', this.handleTick);
	    
	    //layers
	    CanvasView.layerGrid = new createjs.Container();
	    CanvasView.layerHighlight = new createjs.Container();
	    CanvasView.layerBackground = new createjs.Container();
	    CanvasView.layerInput = new createjs.Container();
	    CanvasView.layerOverlay = new createjs.Container();
	    CanvasView.layerMessage = new createjs.Container();
	    CanvasView.context.addChild(CanvasView.layerGrid);
	    CanvasView.context.addChild(CanvasView.layerHighlight);
	    CanvasView.context.addChild(CanvasView.layerBackground);
	    CanvasView.context.addChild(CanvasView.layerInput);
	    CanvasView.context.addChild(CanvasView.layerOverlay);
	    CanvasView.context.addChild(CanvasView.layerMessage);
	    
	    //filters
	    CanvasView.filterBlue = [new createjs.ColorFilter(1,1,1,1, 64,151,211,1)];
	    CanvasView.filterGreen = [new createjs.ColorFilter(1,1,1,1, 112,218,112,1)];
	    CanvasView.filterYellow = [new createjs.ColorFilter(1,1,1,1, 239,236,16,1)];
	    CanvasView.filterRed = [new createjs.ColorFilter(1,1,1,1, 217,87,87,1)];
	    
	    //marker
	    CanvasView.inputMarker = new createjs.Shape();
	    CanvasView.layerInput.addChild(CanvasView.inputMarker);
	    
	    //attributes
	    CanvasView.userFailedAttempts = 0;
	    CanvasView.userGrade = 3;
	    CanvasView.userTargets = null;
	    CanvasView.userCharacter = null;
	    CanvasView.userStroke = null;
	    
	    //resize based on changing settings
	    this.listenTo(Skritter.settings, 'change:canvasWidth', this.resize);
	},
		
	render: function() {
	    this.$el.html(CanvasView.canvas);
	    
	    this.enable();
	    this.drawGrid();
	    
	    if (!CanvasView.userCharacter)
		this.redraw();
	    
	    return this;
	},
		
	events: {
	    'mousedown.CanvasView #canvas-prompt': 'preventDefault',
	    'mouseup.CanvasView #canvas-prompt': 'preventDefault',
	    'mousemove.CanvasView #canvas-prompt': 'preventDefault'
	},
		
	clearAll: function(resetData) {
	    if (resetData) {
		CanvasView.userCharacter = new CanvasCharacter();
		CanvasView.userStroke = new CanvasStroke();
		CanvasView.consecutiveFailedAttempts = 0;
	    }
	    CanvasView.layerBackground.removeAllChildren();
	    CanvasView.layerHighlight.removeAllChildren();
	    CanvasView.layerInput.removeAllChildren();
	    CanvasView.layerInput.addChild(CanvasView.inputMarker);
	    CanvasView.inputMarker.graphics.clear();
	    CanvasView.layerOverlay.removeAllChildren();
	},
		
	disable: function() {
	    CanvasView.context.removeAllEventListeners();
	},
	
	drawGrid: function() {
	    var grid = new createjs.Shape();
	    grid.graphics.beginStroke(Skritter.settings.get('canvasGridColor'));
	    grid.graphics.moveTo(CanvasView.width / 2, 0).lineTo(CanvasView.width / 2, CanvasView.height);
	    grid.graphics.moveTo(0, CanvasView.height / 2).lineTo(CanvasView.width, CanvasView.height / 2);
	    grid.graphics.moveTo(0, 0).lineTo(CanvasView.width, CanvasView.height);
	    grid.graphics.moveTo(CanvasView.width, 0).lineTo(0, CanvasView.height);
	    grid.graphics.endStroke();
	    CanvasView.layerGrid.addChild(grid);
	},
		
	drawPhantomStroke: function(stroke) {
	    if (!stroke)
		return false;
	    stroke = stroke.getBitmapContainer(true);
	    createjs.Tween.get(stroke).to({alpha: 0}, 600, createjs.Ease.sineInOut).call(function() {
		CanvasView.layerOverlay.removeChild(stroke);
	    });
	    CanvasView.layerOverlay.addChild(stroke);
	},
		
	drawStroke: function(stroke) {
	    var bitmap = stroke.getBitmapContainer(true);
	    CanvasView.layerInput.addChild(bitmap);
	    this.handleStrokeComplete();
	},
		
	enable: function() {
	    CanvasView.userCharacter = new CanvasCharacter();
	    CanvasView.context.addEventListener('stagemousedown', handleMouseDown);  
	    CanvasView.context.addEventListener('stagemouseup', _.bind(handleMouseUp, this));
	    
	    var points, prevPoint, prevMidPoint;
	    function handleMouseDown() {
		points = [];
		CanvasView.userStroke = new CanvasStroke();
		prevPoint = new createjs.Point(CanvasView.context.mouseX, CanvasView.context.mouseY);
		prevMidPoint = prevPoint;
		points.push(prevPoint.clone());
		CanvasView.inputMarker.graphics.setStrokeStyle(14, 'round', 'round').beginStroke('orange');
		CanvasView.context.addEventListener('stagemousemove', handleMouseMove);
		CanvasView.context.update();
	    }
	    
	    function handleMouseMove() {
		var curPoint = new createjs.Point(CanvasView.context.mouseX,CanvasView.context.mouseY);
		var curMidPoint = new createjs.Point(prevPoint.x + curPoint.x >> 1, prevPoint.y + curPoint.y >> 1);
		CanvasView.inputMarker.graphics.moveTo(curMidPoint.x, curMidPoint.y).curveTo(prevPoint.x, prevPoint.y, prevMidPoint.x, prevMidPoint.y);
		prevPoint = curPoint;
		prevMidPoint = curMidPoint;
		points.push(prevPoint.clone());
		CanvasView.context.update();
	    }
	    
	    function handleMouseUp(event) {
		if (isOnCanvas(event) && CanvasView.userStroke !== null && Skritter.fn.getLength(points) > 30) {
		    CanvasView.inputMarker.graphics.endStroke();
		    CanvasView.userStroke.set('points', points);
		    
		    var result = new Recognizer(CanvasView.userCharacter, CanvasView.userStroke, CanvasView.userTargets).recognize();
		    if (result && !CanvasView.userCharacter.containsStroke(result)) {
			CanvasView.userFailedAttempts = 0;
			//console.log(result);
			this.drawStroke(result);
		    } else {
			CanvasView.userFailedAttempts++;
			if (CanvasView.userFailedAttempts > 2) {
			    CanvasView.userGrade = 1;
			    //todo: add in the phantom stroke logic
			}
			CanvasView.userStroke = null;
		    }
		    
		    if (CanvasView.userStroke)
			CanvasView.userCharacter.add(CanvasView.userStroke);
		}
		CanvasView.context.removeEventListener('stagemousemove', handleMouseMove);
		this.redraw();
	    }
	    
	    function isOnCanvas(event) {
		var x = event.rawX;
		var y = event.rawY;
		if (x >= 0 && x < CanvasView.width && y >= 0 && y < CanvasView.height)
		    return true;
	    }
	},
		
	getFilterColor: function(color) {
	    var filter;
	    switch (color)
	    {
		case 'blue':
		    filter = CanvasView.filterBlue;
		    break;
		case 'green':
		    filter = CanvasView.filterGreen;
		    break;
		case 'yellow':
		    filter = CanvasView.filterYellow;
		    break;
		case 'red':
		    filter = CanvasView.filterRed;
		    break;
	    }
	    return filter;
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
		
	highlight: function(layer, color) {
	    layer.cache(0, 0, CanvasView.width, CanvasView.height);
	    layer.shadow = new createjs.Shadow("#000000", 5, 5, 10);
	    layer.filters = this.getFilterColor(color);
	    layer.updateCache();
	},
		
	handleTick: function() {
	    CanvasView.context.update();
	},
		
	handleStrokeComplete: function() {
	    this.triggerStrokeComplete();
	    if (this.isCharacterComplete()) {
		CanvasView.inputMarker.graphics.clear();
		if (CanvasView.userGrade === 3) {
		    //this.highlight(CanvasView.layerInput, 'green');
		} else {
		    //this.highlight(CanvasView.layerInput, 'red');
		}
		this.triggerCharacterComplete();
	    }
	},
		
	isCharacterComplete: function() {
	    //console.log('Current Position:');
	    //console.log(CanvasView.userCharacter.getStrokeCount() + '/' + this.getTargetStrokeCount());
	    if (CanvasView.userCharacter.getStrokeCount() >= this.getTargetStrokeCount()) {
		return true;
	    }
	    return false;
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
	
	resize: function() {
	    //todo: fix this and make it work better
	    //it needs to either clear or redraw the strokes
	    CanvasView.width = Skritter.settings.get('canvasWidth');
	    CanvasView.height = Skritter.settings.get('canvasHeight');
	    CanvasView.canvas.setAttribute('width', CanvasView.width);
	    CanvasView.canvas.setAttribute('height', CanvasView.height);
	    CanvasView.layerGrid.removeAllChildren();
	    this.drawGrid();
	},
		
	setTargets: function(canvasCharacters) {
	    CanvasView.correct = true;
	    CanvasView.userTargets = canvasCharacters;
	    //console.log(CanvasView.userTargets);
	},
		
	showTarget: function(alpha, color) {
	    //todo: clean up this method of checking for existing bitmaps
	    if (CanvasView.layerBackground.children.length > 0)
		return false;
	    if (!this.isCharacterComplete())
		CanvasView.correct = false;
	    var character = CanvasView.userTargets[0].getCharacterContainer();
	    if (alpha || color) {
		character.cache(0, 0, CanvasView.width, CanvasView.height);
		character.alpha = alpha;
		character.filters = this.getFilterColor(color);
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
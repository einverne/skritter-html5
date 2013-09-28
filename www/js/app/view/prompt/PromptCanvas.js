/*
 * 
 * View: PromptPromptCanvas
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Recognizer',
    'collection/CanvasCharacter',
    'model/CanvasStroke',
    'view/canvas/DisplayCanvas',
    'view/canvas/InputCanvas',
    'backbone'
], function(Recognizer, CanvasCharacter, CanvasStroke, DisplayCanvas, InputCanvas) {
    
    var PromptCanvas = Backbone.View.extend({
	
	initialize: function() {
	    PromptCanvas.displayCanvas = new DisplayCanvas();
	    PromptCanvas.inputCanvas = new InputCanvas();
	    
	    //attributes and settings
	    PromptCanvas.failedAttempts = 0;
	    PromptCanvas.grade = 3;
	    PromptCanvas.minStrokeDistance = 25;
	    PromptCanvas.rune = false;
	    PromptCanvas.userCharacter;
	    PromptCanvas.userTargets = [];
	    
	    //filters
	    PromptCanvas.gradeColors = {
		1: '#e68e8e',
		2: '#d95757',
		3: '#70da70',
		4: '#4097d3'
	    };
	    
	    if (this.options.grid) 
		PromptCanvas.displayCanvas.drawGrid();
	    
	    //events and listeners
	    this.listenTo(PromptCanvas.inputCanvas, 'mouseup', this.handleMouseUp);
	},
	
	render: function() {
	    this.$el.append("<div id='writing-area'></div>");
	    
	    this.resize();
	    
	    PromptCanvas.displayCanvas.setElement($('#writing-area')).render();
	    PromptCanvas.inputCanvas.setElement($('#writing-area')).render();
	    
	    return this;
	},
		
	clear: function() {
	    PromptCanvas.displayCanvas.clear();
	    PromptCanvas.failedAttempts = 0;
	    PromptCanvas.grade = 3;
	    PromptCanvas.userCharacter = new CanvasCharacter();
	    PromptCanvas.displayCanvas.forceRender();
	},
		
	disable: function() {
	    PromptCanvas.inputCanvas.disable();
	},
		
	displayMessage: function(message) {
	    PromptCanvas.displayCanvas.displayMessage(message, 'black', Skritter.settings.getTextSize() + 'px simhai');
	},
		
	enable: function() {
	    PromptCanvas.inputCanvas.enable();
	},
		
	drawCharacter: function(character) {
	    PromptCanvas.displayCanvas.drawText(character, 0, 0, 'black', 0.2, Skritter.settings.get('canvasSize') + 'px simkai');
	},
		
	getNextStroke: function() {
	    var target = PromptCanvas.userTargets[0];
	    console.log(target);
	    var stroke = target.at(PromptCanvas.userCharacter.length);
	    console.log(stroke);
	    return stroke;
	},
		
	drawStrokes: function() {
	    if (PromptCanvas.userCharacter) {
		var character = PromptCanvas.userCharacter.models;
		for (var i in character)
		{
		    var stroke = character[i];
		    PromptCanvas.displayCanvas.drawStroke(stroke);
		}
	    }
	},	
		
	getTargetStrokeCount: function() {
	    var strokeCount = 0;
	    for (var a in PromptCanvas.userTargets)
	    {
		if (PromptCanvas.userTargets[a].getStrokeCount() > strokeCount) {
		    strokeCount = PromptCanvas.userTargets[a].getStrokeCount();
		}
	    }
	    return strokeCount - 1;
	},

	handleMouseUp: function(points) {
	    if (points.length !== 0) {
		console.log('points', points, Skritter.fn.getDistance(points[0], points[points.length - 1]));
		if (Skritter.fn.getDistance(points[0], points[points.length - 1]) > PromptCanvas.minStrokeDistance) {
		    if (PromptCanvas.rune) PromptCanvas.displayCanvas.fadeOverlay();
		    var stroke = new CanvasStroke().set('points', points);
		    PromptCanvas.inputCanvas.clear();
		    PromptCanvas.inputCanvas.forceRender();
		    this.recognize(stroke);
		}
	    }
	},
		
	handleStrokeDrawn: function() {
	    if (this.isComplete())
		this.triggerCharacterComplete();
	},
		
	isComplete: function() {
	    if (PromptCanvas.userCharacter.getStrokeCount() > this.getTargetStrokeCount())
		return true;
	    return false;
	},
		
	recognize: function(stroke) {
	    var result = new Recognizer(PromptCanvas.userCharacter, stroke, PromptCanvas.userTargets).recognize();    
	    if (result && !PromptCanvas.userCharacter.containsStroke(result)) {
		PromptCanvas.failedAttempts = 0;
		PromptCanvas.userCharacter.add(result);

		if (Skritter.user.get('squigs') && PromptCanvas.rune) {
		    PromptCanvas.displayCanvas.drawSquig(result);
		} else {
		    PromptCanvas.displayCanvas.drawStroke(result, false, _.bind(function() {
			if (this.isComplete())
			    PromptCanvas.displayCanvas.glowCharacter(PromptCanvas.userTargets[0], PromptCanvas.gradeColors[PromptCanvas.grade]);
		    }, this));
		}
		
		if (this.isComplete())
		    this.triggerCharacterComplete();
	    } else {
		PromptCanvas.failedAttempts += 1;
		if (PromptCanvas.failedAttempts > 3) {
		    PromptCanvas.grade = 1;
		    PromptCanvas.displayCanvas.drawStroke(this.getNextStroke(), true);
		}
	    }
	},
		
	remove: function() {
	    this.$('#writing-area').remove();
	},
		
	resize: function() {
	    var canvasSize = Skritter.settings.get('canvasSize');
	    this.$('#writing-area').width(canvasSize);
	    this.$('#writing-area').height(canvasSize);
	},
		
	setGrade: function(grade) {
	    PromptCanvas.grade = grade;
	},
		
	setTargets: function(targets, rune) {
	    PromptCanvas.rune = rune;
	    PromptCanvas.userCharacter = new CanvasCharacter();
	    PromptCanvas.userTargets = targets;
    	},
		
	showTarget: function() {
	    PromptCanvas.displayCanvas.drawCharacter(PromptCanvas.userTargets[0], 0.5);
	},
		
	triggerCharacterComplete: function() {
	    if (Skritter.user.get('squigs') && PromptCanvas.rune) {
		for (var i in PromptCanvas.userCharacter.models)
		{
		    var stroke = PromptCanvas.userCharacter.models[i];
		    PromptCanvas.displayCanvas.drawStroke(stroke);
		}
	    }
	    this.trigger('writing:complete', PromptCanvas.grade);
	}
	
    });
    
    
    return PromptCanvas;
});
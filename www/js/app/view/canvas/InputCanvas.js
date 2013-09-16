/*
 * 
 * View: InputCanvas
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'createjs.easel',
    'backbone'
], function() {
    
    var InputCanvas = Backbone.View.extend({
	
	initialize: function() {
	    //settings and variables
	    InputCanvas.size = Skritter.settings.get('canvasSize');
	    InputCanvas.points = [];
	    InputCanvas.strokeColor = '#000000';
	    InputCanvas.strokeSize = 12;
	    InputCanvas.strokeCapStyle = 'round';
	    InputCanvas.strokeJointStyle = 'round';
	    
	    //create the canvas element
	    InputCanvas.canvas = document.createElement('canvas');
	    InputCanvas.canvas.setAttribute('id', 'input-canvas');
	    InputCanvas.canvas.setAttribute('width', InputCanvas.size);
	    InputCanvas.canvas.setAttribute('height', InputCanvas.size);
	    
	    //binds easeljs stage to the element
	    InputCanvas.stage = new createjs.Stage(InputCanvas.canvas);
	    InputCanvas.stage.autoClear = false;
	    InputCanvas.stage.enableDOMEvents(true);
	    createjs.Touch.enable(InputCanvas.stage);

	    //creates a shape used for drawing
	    InputCanvas.marker = new createjs.Shape();
	    InputCanvas.stage.addChild(InputCanvas.marker);
	},
	
	render: function() {
	    this.$el.append(InputCanvas.canvas);
	    this.enable();
	    return this;
	},
		
	forceRender: function() {
	    //quick ugly fix for some rendering issues
	    $(InputCanvas.canvas).css('display', 'block');
	    setTimeout(function() {
		$(InputCanvas.canvas).css('display', 'inline-block');
	    }, 0);
	},
		
	clear: function() {
	    InputCanvas.points = [];
	    InputCanvas.stage.clear();
	},
	
	disable: function() {
	    InputCanvas.stage.removeAllEventListeners();
	},
		
	enable: function() {
	    var self = this;
	    var oldPt, oldMidPt;
	    var stage = InputCanvas.stage;
	    stage.addEventListener("stagemousedown", handleMouseDown);
	    stage.addEventListener("stagemouseup", handleMouseUp);
	    function handleMouseDown() {
		self.triggerMouseDown();
		InputCanvas.points = [];
		oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
		oldMidPt = oldPt;
		InputCanvas.points.push(oldPt.clone());
		self.forceRender();
		stage.addEventListener("stagemousemove", handleMouseMove);
	    }
	    function handleMouseMove() {
		var point = new createjs.Point(stage.mouseX, stage.mouseY);
		var midPt = new createjs.Point(oldPt.x + point.x >> 1, oldPt.y + point.y >> 1);
		InputCanvas.marker.graphics.clear()
			.setStrokeStyle(InputCanvas.strokeSize, InputCanvas.strokeCapStyle, InputCanvas.strokeJointStyle)
			.beginStroke(InputCanvas.strokeColor)
			.moveTo(midPt.x, midPt.y)
			.curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
		oldPt.x = point.x;
		oldPt.y = point.y;
		oldMidPt.x = midPt.x;
		oldMidPt.y = midPt.y;
		
		InputCanvas.points.push(oldPt.clone());
		self.triggerMouseMove(point);
		stage.update();
	    }
	    function handleMouseUp(event) {
		if (isOnCanvas(event)) {
		    self.triggerMouseUp();
		}
		stage.removeEventListener("stagemousemove", handleMouseMove);
	    }
	    function isOnCanvas(event) {
		var x = event.rawX;
		var y = event.rawY;
		if (x >= 0 && x < InputCanvas.size && y >= 0 && y < InputCanvas.size)
		    return true;
	    }
	},
	
	triggerMouseDown: function() {
	    this.trigger('mousedown');
	},
	
	triggerMouseMove: function(point) {
	    this.trigger('mousemove', point);
	},
	
	triggerMouseUp: function() {
	    this.trigger('mouseup', InputCanvas.points);
	},
		
	update: function() {
	    InputCanvas.stage.update();
	}
	
    });
    
    
    return InputCanvas;
});
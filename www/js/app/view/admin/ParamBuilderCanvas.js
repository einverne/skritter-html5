/*
 * 
 * View: ParamBuilderCanvas
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/CanvasStroke',
    'view/canvas/DisplayCanvas',
    'view/canvas/InputCanvas',
    'backbone'
], function(CanvasStroke, DisplayCanvas, InputCanvas) {
    
    var ParamBuilderCanvas = Backbone.View.extend({
	
	initialize: function() {
	    ParamBuilderCanvas.displayCanvas = new DisplayCanvas();
	    ParamBuilderCanvas.inputCanvas = new InputCanvas();
	    ParamBuilderCanvas.param;
	    ParamBuilderCanvas.stroke;
	    
	    if (this.options.grid) 
		ParamBuilderCanvas.displayCanvas.drawGrid();
	    
	    //events and listeners
	    this.listenTo(ParamBuilderCanvas.inputCanvas, 'mouseup', this.handleMouseUp);
	},
	
	render: function() {
	    ParamBuilderCanvas.displayCanvas.setElement($('#writing-area')).render();
	    ParamBuilderCanvas.inputCanvas.setElement($('#writing-area')).render();
	    return this;
	},
		
	clear: function() {
	    ParamBuilderCanvas.displayCanvas.clear();
	},
		
	drawBitmap: function() {
	    ParamBuilderCanvas.displayCanvas.drawBitmap(ParamBuilderCanvas.param.getBitmap());
	},
		
	drawParam: function() {
	    console.log(ParamBuilderCanvas.param);
	    ParamBuilderCanvas.displayCanvas.drawPoints(ParamBuilderCanvas.param.get('corners'));
	},
		
	drawUserBitmap: function() {
	    ParamBuilderCanvas.displayCanvas.drawBitmap(ParamBuilderCanvas.stroke.getUserBitmap(), 0.5, [new createjs.ColorFilter(0,0,0,1, 0,0,255,0)]);
	},
		
	handleMouseUp: function(points) {
	    console.log('Points', points);
	    ParamBuilderCanvas.inputCanvas.clear();
	    ParamBuilderCanvas.inputCanvas.forceRender();
	},
		
	set: function(param) {
	    ParamBuilderCanvas.param = param;
	    ParamBuilderCanvas.stroke = new CanvasStroke({
		'bitmap': ParamBuilderCanvas.param.getBitmap(),
		'corners': ParamBuilderCanvas.param.get('corners'),
		'points': ParamBuilderCanvas.param.get('corners')
	    });
	}
	
    });
    
    
    return ParamBuilderCanvas;
});
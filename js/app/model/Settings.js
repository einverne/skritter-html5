/*
 * 
 * Model: Settings
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'backbone'
], function() {
    
    var Settings = Backbone.Model.extend({
	
	initialize: function() {
	    this.updateDimensions();
	    $(window).resize(_.bind(this.updateDimensions, this));
	},
	
	defaults: {
	    apiClientId: 'mcfarljwapiclient',
	    apiDomain: 'cn',
	    apiRoot: 'http://beta.skritter',
	    apiClientSecret: 'e3872517fed90a820e441531548b8c',
	    appHeight: 0,
	    appWidth: 0,
	    canvasSize: 0,
	    canvasSizeMax: 600,
	    container: '#skritter-container',
	    orientation: 'vertical',
	    version: '0.0.5'
	},
		
	getCanvasAspectRatio: function() {
	    return this.get('canvasSize') / this.get('canvasSizeMax');
	},
		
	getTextSize: function() {
	    return Math.round(this.get('canvasSize') * 0.05);
	},
		
	updateDimensions: function() {
	    var height = $(this.get('container')).height();
	    var width = $(this.get('container')).width();
	    //set the fullscreen dimensions
	    this.set('appHeight', height);
	    this.set('appWidth', width);
	    //set the orientation and canvas size
	    if (width < height) {
		console.log('vertically oriented');
		this.set('orientation', 'vertical');
		if (width > this.get('canvasSizeMax')) {
		    this.set('canvasSize', this.get('canvasSizeMax'));
		} else {
		    this.set('canvasSize', width);
		}
	    } else {
		console.log('horizontally oriented');
		this.set('orientation', 'horizontal');
		if (height > this.get('canvasSizeMax')) {
		    this.set('canvasSize', this.get('canvasSizeMax'));
		} else {
		    this.set('canvasSize', height);
		}
	    }
	}
	
    });
    
    
    return Settings;
});
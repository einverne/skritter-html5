/*
 * 
 * Module: Assets
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'backbone',
    'createjs.easel',
    'createjs.preload'
], function() {
    
    var Assets = Backbone.Model.extend({
	
	initialize: function() {
	    Assets.queue = new createjs.LoadQueue();
	    
	    var handleComplete = function() {
		this.triggerComplete();
	    };
	    
	    var handleError = function(error) {
		console.error(error);
	    };
	    
	    Assets.queue.addEventListener('complete', _.bind(handleComplete, this));
	    Assets.queue.addEventListener('error', handleError);
	},
	
	getStroke: function(bitmapId) {
	    return Assets.queue.getItem('stroke_' + bitmapId);
	},
	
	loadStrokes: function() {
	    for (var i=0; i <= 387; i++ )
	    {
		Assets.queue.loadFile({
		   id: 'stroke_' + i,
		   src: 'img/stroke/' + Skritter.fn.pad(i, 0, 4) + '.png'
		}, false);
	    }
	    Assets.queue.load();
	},
	
	loadTextures: function() {
	    for (var i=0; i <= 3; i++)
	    {
		Assets.queue.loadFile({
		    id:'strokesheet_' + i,
		    src:'img/texture/stroke/black/strokes-' + i + '.png'
		}, false);
		Assets.queue.loadFile({
		    id:'strokejson_' + i,
		    src:'img/texture/stroke/black/strokes-' + i + '.json'
		}, false);
	    }
	    Assets.queue.load();
	},
		
	triggerComplete: function() {
	    this.trigger('complete');
	}
	
    });
    
    return Assets;
});
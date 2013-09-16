/*
 * 
 * Module: Assets
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'backbone',
    'createjs.preload',
    'createjs.sound'
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
		
	getAudio: function(audioId) {
	    var audio;
	    if (createjs.Sound.idHash[audioId]) {
		audio = createjs.Sound.play(audioId);
		return audio;
	    }
	    if (!createjs.Sound.hasEventListener('fileload')) {
		createjs.Sound.addEventListener('fileload', handleLoad);
	    }
	    createjs.Sound.registerSound('media/audio/zh/' + audioId, audioId, 5);
	    function handleLoad(event) {
		window.setTimeout(function() {
		    createjs.Sound.play(event.id);
		}, 500);
	    }
	    return audio;
	},
	
	getStroke: function(bitmapId) {
	    return Assets.queue.getItem('stroke_' + bitmapId);
	},
	
	loadStrokes: function() {
	    for (var i=0; i <= 387; i++ )
	    {
		Assets.queue.loadFile({
		   id: 'stroke_' + i,
		   src: 'media/image/stroke/' + Skritter.fn.pad(i, 0, 4) + '.png'
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
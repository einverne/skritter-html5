/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone',
    'createjs.preload',
    'createjs.sound'
], function() {
    
    var Assets = Backbone.Model.extend({
	/**
         * @class Assets
         * @constructor
         */
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
		
	/**
         * @method getAudio
         * @param {String} audioId
         * @return {Object}
         */
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
	
        /**
         * @method getStroke
         * @param {String} bitmapId
         * @return {Bitmap}
         */
	getStroke: function(bitmapId) {
	    return Assets.queue.getItem('stroke_' + bitmapId);
	},
	
        /**
         * @method loadStrokes
         */
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
	
        /**
         * @method triggerComplete
         */	
	triggerComplete: function() {
	    this.trigger('complete');
	}
	
    });
    
    return Assets;
});
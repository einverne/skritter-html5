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
         * Plays an audio file using SoundJS and loads it from the Skritter web server.
         * This might not work on builds not located on the physical server due to
         * Access-Control-Allow-Origin restrictions.
         * 
         * @method getAudio
         * @param {String} audioUrl
         * @return {Object}
         */
        getAudio: function(audioUrl) {
	    var audio;
	    if (createjs.Sound.idHash[audioUrl]) {
		audio = createjs.Sound.play(audioUrl);
		return audio;
	    }
	    if (!createjs.Sound.hasEventListener('fileload')) {
		createjs.Sound.addEventListener('fileload', handleLoad);
	    }
            console.log(Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + audioUrl);
	    createjs.Sound.registerSound(Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + audioUrl, 5);
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
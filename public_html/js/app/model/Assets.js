/**
 * @module Skritter
 * @submodule Model
 * @param StrokeMap
 * @author Joshua McFarland
 */
define([
    'StrokeMap',
    'backbone',
    'createjs.preload'
], function(StrokeMap) {
    /**
     * @class Assets
     * @constructor
     */
    var Assets = Backbone.Model.extend({
        /**
         * @method initialize
         */
	initialize: function() {
            Assets.audioPlayer = new Audio();
	    Assets.queue = new createjs.LoadQueue();
            Assets.strokes = null;
	},	
	/**
         * Plays an audio file using the native HTML5 audio element.
         * 
         * @method getAudio
         * @param {String} audioId
         * @return {Object}
         */
        getAudio: function(audioId) {
            if (Assets.audioPlayer.paused) {
                Assets.audioPlayer.src = Skritter.settings.get('apiRoot') + '.' + Skritter.settings.get('apiDomain') + '/sounds?file=' + audioId;
                Assets.audioPlayer.play();
            }
            return Assets.audioPlayer;
        },
        /**
         * Returns a stroke in the form of a sprite from the preloaded spritesheet.
         * 
         * @method getStroke
         * @param {String} bitmapId
         * @return {Sprite}
         */
        getStroke: function(bitmapId) {
            return new createjs.Sprite(Assets.strokes, 's' + bitmapId);
        },
        /**
         * Loads the strokes as a spritesheet and returns a callback once they have been preloaded.
         * 
         * @method loadStrokes
         * @param {Function} callback
         */
	loadStrokes: function(callback) {
            var handleComplete = function() {
                callback(Assets.strokes);
            };
            Assets.strokes = new createjs.SpriteSheet(StrokeMap);
            if (!Assets.strokes.complete) {
                Assets.strokes.addEventListener('complete', handleComplete);
            } else {
                callback(Assets.strokes);
            }
	}
    });
    
    return Assets;
});
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
            Assets.strokeSpriteSheet = null;
            Assets.strokeSprites= null;
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
            return Assets.strokeSprites[bitmapId].clone();
        },
        /**
         * Returns the current instance of the stroke spritesheet.
         * 
         * @method getStrokeSpriteSheet
         * @returns {SpriteSheet}
         */
        getStrokeSpriteSheet: function() {
            return Assets.strokeSpriteSheet;
        },
        /**
         * Loads the strokes as a spritesheet and returns a callback once they have been preloaded.
         * 
         * @method loadStrokes
         * @param {Function} callback
         */
	loadStrokeSprites: function(callback) {
            var loadSprites = function() {
                var strokeSprites = {};
                var animationIds = Assets.strokeSpriteSheet.getAnimations();
                for (var i in animationIds) {
                    strokeSprites[parseInt(animationIds[i].replace('s', ''), 10)] = new createjs.Sprite(Assets.strokeSpriteSheet, animationIds[i]);
                }
                Assets.strokeSprites = strokeSprites;
                callback(strokeSprites);
            };
            Assets.strokeSpriteSheet = new createjs.SpriteSheet(StrokeMap);
            if (!Assets.strokeSpriteSheet.complete) {
                Assets.strokeSpriteSheet.addEventListener('complete', loadSprites);
            } else {
                loadSprites();
            }
	}
    });
    
    return Assets;
});
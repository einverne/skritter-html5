/**
 * @module Skritter
 * @submodule Model
 * @param Strokes
 * @author Joshua McFarland
 */
define([
    'Strokes',
    'backbone',
    'createjs.preload'
], function(Strokes) {
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
            Assets.strokeSpriteSheets = [];
            Assets.strokeSprites = {};
            Assets.strokeShapes = {};
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
            if (Skritter.settings.get('strokeFormat') === 'vector')
                return Assets.strokeShapes[bitmapId].clone();
            return Assets.strokeSprites[bitmapId].clone();
        },
        /**
         * Returns the current instance of the stroke spritesheet.
         * 
         * @method getStrokeSprites
         * @returns {Object}
         */
        getStrokeSprites: function() {
            return Assets.strokeSprites;
        },
        /**
         * @method loadStrokeShapes
         * @param {Function} callback
         */
        loadStrokeShapes: function(callback) {
            Assets.strokeShapes = Strokes.getStrokeShapes();
            callback();
        },
        /**
         * Loads the strokes as a spritesheet and returns a callback once they have been preloaded.
         * 
         * @method loadStrokeSprites
         * @param {Function} callback
         */
	loadStrokeSprites: function(callback) {
            var loadSprites = function(sheets) {
                for (var a in sheets) {
                    var sheet = sheets[a];
                    var animations = sheet.getAnimations();
                    for (var b in animations)
                        Assets.strokeSprites[animations[b].replace('s', '')] = new createjs.Sprite(sheet, animations[b]);
                }
                Assets.strokeSpriteSheets = sheets;
                callback();
            };
            
            Strokes.getSpriteSheets(loadSprites);
            
            
	}
    });
    
    return Assets;
});
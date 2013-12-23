/**
 * @module Skritter
 * @submodule Model
 * @param Strokes
 * @author Joshua McFarland
 */
define([
    'Strokes',
    'backbone'
], function(Strokes) {
    /**
     * @class Assets
     */
    var Assets = Backbone.Model.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Assets.audioPlayer = new Audio();
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
                Assets.audioPlayer.src = skritter.api.root + '.' + skritter.api.domain + '/sounds?file=' + audioId;
                Assets.audioPlayer.play();
            }
            return Assets.audioPlayer;
        },
        /**
         * Returns a stroke in the form of a sprite from the preloaded spritesheet.
         * 
         * @method getStroke
         * @param {String} bitmapId
         * @param {String} color
         * @return {Sprite}
         */
        getStroke: function(bitmapId, color) {
            color = (color) ? color : '#000000';
            return Strokes[bitmapId](color).clone();
        }
    });

    return Assets;
});
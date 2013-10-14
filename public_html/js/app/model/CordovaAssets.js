/**
 * @module Skritter
 * @param Assets
 * @author Joshua McFarland
 */
define([
    'model/Assets',
    'backbone'
], function(Assets) {
    /**
     * Extend and overrides the assets model to provide Cordova specific functionality.
     * 
     * @class CordovaAssets
     * @extends Assets
     */
    var CordovaAssets = Assets.extend({
       /**
        * Uses the media plugin for Cordova to play locally stored audio files.
        * 
        * @method getAudio
        * @param {String} audioId
        * @param {Function} callback
        * @returns {Media}
        */ 
        getAudio: function(audioId, callback) {
            var successCB = function() {
                if (typeof callback === 'function')
                    callback();
            };
            var errorCB = function(error) {
		console.error(error);
	    };
	    var audio = new Media('/android_asset/www/media/audio/' + Skritter.user.getSetting('targetLang') + '/' + audioId, successCB, errorCB);
	    audio.play();
	    return audio;
	}
    });
    
    
    return CordovaAssets;
});
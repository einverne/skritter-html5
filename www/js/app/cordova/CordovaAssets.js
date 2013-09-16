/*
 * 
 * Model: Assets
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/Assets'
], function(Assets) {
    
    var CordovaAssets = Assets.extend({
	
	getAudio: function(audioId) {
	    var audio = new Media('/android_asset/www/media/audio/' + Skritter.user.get('targetLang') + '/' + audioId, successCB, errorCB);

	    function successCB() {
	    }

	    function errorCB(error) {
		console.error(error);
	    }
	    
	    audio.play();
	    
	    return audio;
	}
	
    });
    
    
    return CordovaAssets;
});
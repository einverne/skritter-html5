/*
 * 
 * Model: Settings
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * Contains all of the application-specific settings not controlled by the user.
 * User specific settings can be found in the StudyUser model.
 * 
 */
define([
    'backbone'
], function() {

    var Settings = Backbone.Model.extend({
	
	defaults: {
	    apiClientId: 'mcfarljwapiclient',
	    apiClientSecret: 'e3872517fed90a820e441531548b8c',
	    apiDomain: 'cn',
	    height: null,
	    appWidth: null,
	    canvasAnimationSpeed: 200,
	    canvasBackgroundColor: '#ffffff',
	    canvasBrushSize: 14,
	    canvasGridColor: '#cccccc',
	    canvasHeight: null,
	    canvasMax: 600,
	    canvasOverlayColor: 'red',
	    canvasWidth: null,
	    container: '#skritter',
	    version: '0.004'
	}
	
    });

    return Settings;
});
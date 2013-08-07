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
	    canvasMessageColor: '#ff7700',
	    canvasMessageFont: '20px Arial',
	    canvasOverlayColor: 'red',
	    canvasWidth: null,
	    container: '#skritter',
	    gradeColor1:'#e68e8e',
	    gradeColor2:'#d95757',
	    gradeColor3:'#70da70',
	    gradeColor4:'#4097d3',
	    version: '0.0.4'
	}
	
    });

    return Settings;
});
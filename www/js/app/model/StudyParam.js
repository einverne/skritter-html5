/*
 * 
 * Model: StudyParam
 * 
 * Created By: Joshua McFarland
 * 
 * Properties
 * bitmapId
 * contains
 * corners
 * deviations
 * feedback
 * 
 */
define([
    'createjs.easel',
    'backbone'
], function() {
    
    var StudyParam = Backbone.Model.extend({
	
	getAngle: function() {
	    return Skritter.fn.getAngle(this.get('corners'));
	},
	
	getBitmap: function() {
	    return new createjs.Bitmap(Skritter.assets.getStroke(this.get('bitmapId')).src);
	},
	
	getLength: function() {
	    var length = 0;
	    for (var i = 0; i < this.get('corners').length - 1; i++)
	    {
		length += Skritter.fn.getDistance(this.get('corners')[i], this.get('corners')[i + 1]);
	    }
	    return length;
	}
	
    });
    
    
    return StudyParam;
});
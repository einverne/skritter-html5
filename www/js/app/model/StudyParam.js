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
    'backbone'
], function() {
    
    var StudyParam = Backbone.Model.extend({
	
	getAngle: function() {
	    return Skritter.fn.getAngle(this.get('corners'));
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
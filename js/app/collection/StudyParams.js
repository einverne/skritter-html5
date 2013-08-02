/*
 * 
 * Collection: StudyParams
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudyParam',
    'backbone'
], function(StudyParam) {
    var Skritter = window.skritter;
    
    var StudyParams = Backbone.Collection.extend({
	
	model: StudyParam,
		
	cache: function() {
	    Skritter.storage.setItems('params', this.toJSON());
	}
	
    });
    
    return StudyParams;
});
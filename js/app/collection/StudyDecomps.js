/*
 * 
 * Collection: StudyDecomps
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudyDecomp',
    'backbone'
], function(StudyDecomp) {
    
    var StudyDecomps = Backbone.Collection.extend({
	
	model: StudyDecomp,
		
	loadAll: function(callback) {
	    Skritter.storage.getItems('decomps', function(decomps) {
		console.log('loading decomps');
		Skritter.study.decomps.add(decomps);
		callback(null, decomps);
	    });
	}
	
    });
    
    
    return StudyDecomps;
});
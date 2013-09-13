/*
 * 
 * Collection: StudyParams
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'Params',
    'model/StudyParam',
    'backbone'
], function(Params, StudyParam) {
    
    var StudyParams = Backbone.Collection.extend({
	
	model: StudyParam,
		
	loadAll: function(callback) {
	    console.log('loading params');
	    Skritter.study.params.add(Params);
	    callback(null, Params);
	}
	
    });
    
    
    return StudyParams;
});
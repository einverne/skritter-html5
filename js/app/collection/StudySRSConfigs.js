/*
 * 
 * Collection: StudySRSConfigs
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudySRSConfig',
    'backbone'
], function(StudySRSConfig) {
    
    var StudySRSConfigs = Backbone.Collection.extend({
	
	model: StudySRSConfig,
		
	loadAll: function(callback) {
	    Skritter.storage.getItems('srsconfigs', function(srsconfigs) {
		console.log('loading srsconfigs');
		Skritter.study.srsconfigs.add(srsconfigs);
		callback(null, srsconfigs);
	    });
	}
	
    });
    
    
    return StudySRSConfigs;
});
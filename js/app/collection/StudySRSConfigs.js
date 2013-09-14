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
	
	cache: function(callback) {
	    if (this.length === 0) {
		callback();
		return;
	    }
	    Skritter.storage.setItems('srsconfigs', this.toJSON(), function() {
		if (typeof callback === 'function')
		    callback();
	    });
	},
		
	fetch: function(callback) {
	    Skritter.api.getSRSConfigs(function(result) {
		Skritter.study.srsconfigs.add(result);
		callback(null, result);
	    });
	},
	
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
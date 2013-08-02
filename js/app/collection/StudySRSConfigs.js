define([
    'model/StudySRSConfig',
    'backbone'
], function(StudySRSConfig) {
    var Skritter = window.skritter;
    
    var StudySRSConfigs = Backbone.Collection.extend({
	
	model: StudySRSConfig
	
    });
    
    return StudySRSConfigs;
});
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
    var Skritter = window.skritter;
    
    var StudyDecomps = Backbone.Collection.extend({
	
	model: StudyDecomp
	
    });
    
    return StudyDecomps;
});
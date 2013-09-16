/*
 * 
 * Model: StudyDecomp
 * 
 * Created By: Joshua McFarland
 * 
 * Properties
 * writing
 * atomic
 * Children
 * 
 */
define([
    'backbone'
], function() {
    
    var StudyDecomp = Backbone.Model.extend({
	
	idAttribute: 'writing'
	
    });
    
    
    return StudyDecomp;
});
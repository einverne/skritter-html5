/*
 * 
 * Model: StudyStroke
 * 
 * Created By: Joshua McFarland
 * 
 * Properties
 * rune
 * lang
 * strokes
 * 
 */
define([
    'backbone'
], function() {
    
    var StudyStroke = Backbone.Model.extend({
	
	idAttribute: 'rune'
	
    });
    
    
    return StudyStroke;
});
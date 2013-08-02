/*
 * 
 * Collection: StudySentences
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudySentence',
    'backbone'
], function(StudySentence) {
    var Skritter = window.skritter;
    
    var StudySentences = Backbone.Collection.extend({
	
	model: StudySentence
	
    });
    
    return StudySentences;
});
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
    
    var StudySentences = Backbone.Collection.extend({
	
	model: StudySentence,
	
	cache: function(callback) {
	    if (this.length === 0) {
		callback();
		return;
	    }
	    Skritter.storage.setItems('sentences', this.toJSON(), function() {
		if (typeof callback === 'function')
		    callback();
	    });
	},
	    
	loadAll: function(callback) {
	    Skritter.storage.getItems('sentences', function(sentences) {
		console.log('loading sentences');
		Skritter.study.sentences.add(sentences);
		callback(null, sentences);
	    });
	}
	
    });
    
    
    return StudySentences;
});
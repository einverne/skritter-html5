/*
 * 
 * Collection: StudyVocabs
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudyVocab',
    'backbone'
], function(StudyVocab) {
    
    var StudyVocabs = Backbone.Collection.extend({
	
	model: StudyVocab,
		
	loadAll: function(callback) {
	    Skritter.storage.getItems('vocabs', function(vocabs) {
		console.log('loading vocabs');
		Skritter.study.vocabs.add(vocabs);
		callback(null, vocabs);
	    });
	}
	
    });
    
    
    return StudyVocabs;
});
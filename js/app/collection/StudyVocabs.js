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
    var Skritter = window.skritter;
    
    var StudyVocabs = Backbone.Collection.extend({
	
	model: StudyVocab,
		
	getContainedVocabIds: function() {
	    var ids = [];
	    for (var i in this.models)
	    {
		if (this.models[i].has('containedVocabIds')) {
		    var items = this.models[i].get('containedVocabIds');
		    for (var a in items)
		    {
			ids.push(items[a]);
		    }
		} else {
		    ids.push(this.models[i].get('id'));
		}
	    }
	    return _.uniq(ids);
	}
	
    });
    
    return StudyVocabs;
});
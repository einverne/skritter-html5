/*
 * 
 * Model: StudyItem
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'backbone'
], function() {
   var Skritter = window.skritter;
   
    var StudyItem = Backbone.Model.extend({
	
	getReadiness: function() {
	    //todo: make more robust and accurate
	    var since = Skritter.fn.getUnixTime() - this.get('last');
	    var rtd = this.get('next') - this.get('last');
	    var r = since / rtd;
	    return r;
	},
	
	getStudyVocabs: function() {
	    var vocabs = [];
	    for (var i in this.get('vocabIds'))
	    {
		vocabs.push(Skritter.studyVocabs.findWhere({ id:this.get('vocabIds')[i] }));
	    }
	    return vocabs;
	}
	
    });

    return StudyItem;
});
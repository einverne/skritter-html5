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
	
	initialize: function() {
	    this.on('change:interval', function(item) {
		Skritter.storage.setItem('items', item.toJSON());
	    });
	},
	
	getReadiness: function(deprioritizeLongShots) {
	    var last = this.get('last');
	    var next = this.get('next');
	    var now = Skritter.fn.getUnixTime();
	    
	    if (!last && next - now > 600)
		return 0.2;
	    
	    if (!last || next - last === 1)
		return 90019001;
    
	    var seenAgo =  now - last;
	    var rtd = next - last;
	    var readiness = seenAgo / rtd;
	    
	    if (readiness < 0 && rtd > 1)
	    {
		readiness = 0.7;
	    }
	    
	    if (readiness > 0.0 && seenAgo > 9000.0) {
		//todo
	    }
	    
	    if (deprioritizeLongShots) {
		//todo
	    }
	    
	    return readiness;
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
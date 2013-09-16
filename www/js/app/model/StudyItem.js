/*
 * 
 * Model: StudyItem
 * 
 * Created By: Joshua McFarland
 * 
 * Properties
 * id
 * part
 * vocabIds
 * style
 * timeStudied
 * next
 * last
 * interval
 * vocabListIds
 * sectionIds
 * reviews
 * successes
 * created
 * changed
 * previousSuccess
 * previousInterval
 * 
 */
define([
    'backbone'
], function() {
    
    var StudyItem = Backbone.Model.extend({
	
	initialize: function() {
	    this.on('change', this.cache);
	},
	
	cache: function(callback) {
	    Skritter.storage.setItem('items', this.toJSON(), function() {
		if (typeof callback === 'function')
		    callback();
	    });
	},
	
	getReadiness: function(deprioritizeLongShots, singleCharacter) {
	    var last = this.get('last');
	    var next = this.get('next');
	    var t = Skritter.fn.getUnixTime();
	    
	    if (!last && next - t > 600)
		return 0.2;
	    
	    if (!last || next - last === 1)
		return 90019001;
	    
	    var lengthPenalty = singleCharacter ? -0.02 : 0;
	    
	    if (t < last)
		return 0.0;
	    
	    var seenAgo = t - last;
	    var rtd = next - last;
	    var readiness = seenAgo / rtd;
	    
	    if(readiness < 0 && rtd > 1) {
		readiness = 0.7;
	    }
	    
	    if(readiness > 0.0 && seenAgo > 9000.0) {
		var dayBonus = 1.0;
		var ageBonus = 0.1 * Math.log(dayBonus + (Math.pow(dayBonus, 2) * seenAgo) * (1/86400));
		var readiness2 = readiness > 1.0 ? 0.0 : 1.0 - readiness;
		ageBonus *= Math.pow(readiness2, 2);
		readiness += ageBonus;
	    }
	    
	    if (deprioritizeLongShots) {
		if (readiness > 2.5 && rtd > 600.0) {
		    if (readiness > 20.0)
			readiness = 1.5;
		    else
			readiness = 3.5 - Math.pow(readiness * 0.4, 0.33333);
		}
		if (lengthPenalty && readiness > 1) {
		    readiness = pow(readiness, 1 + lengthPenalty);
		}
	    }
	    
	    return readiness;
	},
	
	getVocabs: function() {
	    var vocabs = [];
	    for (var i in this.get('vocabIds'))
	    {
		vocabs.push(Skritter.study.vocabs.findWhere({ id:this.get('vocabIds')[i] }));
	    }
	    return vocabs;
	},
	
	isActive: function() {
	    if (this.get('vocabIds').length > 0)
		return true;
	    return false;
	},
		
	play: function() {
	    var vocab = this.getVocabs()[0];
	    vocab.play();
	}
	
    });
    
    
    return StudyItem;
});
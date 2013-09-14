/*
 * 
 * Model: StudyReview
 * 
 * Created By: Joshua McFarland
 * 
 * Properties
 * itemId
 * score
 * bearTime
 * submitTime
 * reviewTime
 * thinkingTime
 * currentInterval
 * actualInterval
 * newInterval
 * wordGroup
 * previousInterval
 * previousSuccess
 * 
 */
define([
    'backbone'
], function() {
    
    var StudyReview = Backbone.Model.extend({
	
	initialize: function() {
	    this.on('change', this.cache);
	},
	
	idAttribute: 'itemId',
		
	cache: function(callback) {
	    Skritter.storage.setItem('reviews', this.toJSON(), function() {
		if (typeof callback === 'function')
		    callback();
	    });
	}
	
    });
    
    
    return StudyReview;
});
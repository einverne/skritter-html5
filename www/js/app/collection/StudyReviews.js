/*
 * 
 * Collection: StudyReviews
 * 
 * Created By: Joshua McFarland
 * 
 */
define([
    'model/StudyReview',
    'backbone'
], function(StudyReview) {
    
    var StudyReviews = Backbone.Collection.extend({
	
	model: StudyReview,
	
	cache: function(callback) {
	    if (this.length === 0) {
		callback();
		return;
	    }
	    Skritter.storage.setItems('reviews', this.toJSON(), function() {
		if (typeof callback === 'function')
		    callback();
	    });
	},
	
	getTime: function() {
	    var time = 0;
	    for (var i in this.models)
	    {
		var review = this.models[i];
		if (review.get('bearTime'))
		    time += review.get('reviewTime');
	    }
	    return time;
	},
	
	loadAll: function(callback) {
	    Skritter.storage.getItems('reviews', function(reviews) {
		console.log('loading reviews');
		Skritter.study.reviews.add(reviews);
		callback(null, reviews);
	    });
	},
		
	save: function() {
	    Skritter.api.postReviews(this.toJSON());
	}
	
    });
    
    
    return StudyReviews;
});
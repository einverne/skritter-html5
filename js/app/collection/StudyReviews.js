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
		
	loadAll: function(callback) {
	    Skritter.storage.getItems('reviews', function(reviews) {
		console.log('loading reviews');
		Skritter.study.reviews.add(reviews);
		callback(null, reviews);
	    });
	}
	
    });
    
    
    return StudyReviews;
});
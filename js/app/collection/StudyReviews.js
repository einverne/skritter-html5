/*
 * 
 * Collection: StudyReviews
 * 
 * Created By: Joshua McFarland
 * 
 * Description:
 * Holds reviews that need to be uploaded to the server via the api.
 * 
 */
define([
    'model/StudyReview',
    'backbone'
], function(StudyReview) {
    
    var StudyReviews = Backbone.Collection.extend({
	
	model: StudyReview
	
    });
    
    return StudyReviews;
});
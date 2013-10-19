/**
 * @module Skritter
 * @submodule Collection
 * @param StudyReview
 * @author Joshua McFarland
 */
define([
    'model/StudyReview',
    'backbone'
], function(StudyReview) {
    /**
     * @class StudyReviews
     */
    var StudyReviews = Backbone.Collection.extend({
        /**
         * @property {StudyReview} model
         */
        model: StudyReview,
        /**
         * @method cache
         * @param {Function} callback
         */
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
        /**
         * Returns the total time of all local reviews thats haven't been submitted in milliseconds.
         * 
         * @method getTime
         * @returns {Number} Time in milliseconds
         */
        getTime: function() {
            var time = 0;
            for (var i in this.models) {
                var review = this.models[i];
                if (review.get('bearTime'))
                    time += parseInt(review.get('reviewTime'), 10);
            }
            return time * 1000;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            Skritter.storage.getItems('reviews', function(reviews) {
                Skritter.study.reviews.add(reviews);
                callback(null, reviews);
            });
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            Skritter.api.postReviews(this.toJSON(), function(event) {
                console.log(event);
                callback();
            });
        }

    });


    return StudyReviews;
});
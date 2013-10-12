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
         * @returns {undefined}
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
         * @method getTime
         * @returns {Number} The total time of all reviews
         */
        getTime: function() {
            var time = 0;
            for (var i in this.models) {
                var review = this.models[i];
                if (review.get('bearTime'))
                    time += review.get('reviewTime');
            }
            return time;
        },
        /**
         * @async
         * @method loadAll
         * @param {Function} callback
         * @returns {undefined}
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
         * @returns {undefined}
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
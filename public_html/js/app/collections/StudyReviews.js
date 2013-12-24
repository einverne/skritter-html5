/**
 * @module Skritter
 * @submodule Collection
 * @param StudyReview
 * @author Joshua McFarland
 */
define([
    'models/StudyReview',
    'backbone'
], function(StudyReview) {
    /**
     * @class StudyReviews
     */
    var StudyReviews = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('add', function(review) {
                review.cache();
            });
            this.on('change', function(review) {
                review.cache();
            });
            this.on('remove', function(review) {
                skritter.storage.removeItems('reviews', review.get('id'));
            });
        },
        /**
         * @property {StudyReview} model
         */
        model: StudyReview,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('reviews', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method comparator
         * @param {Backbone.Model} review
         */
        comparator: function(review) {
            return -review.get('submitTime');
        },
        /**
         * @method getTotalTime
         * @returns {Number}
         */
        getTotalTime: function() {
            var time = 0;
            for (var i in this.models)
                if (this.models[i].get('bearTime') && skritter.moment(this.models[0].submitTime).format('YYYY[-]MM[-]DD') === skritter.settings.get('date'))
                    time += parseInt(this.models[i].get('reviewTime'), 10);
            return time * 1000;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('reviews', function(reviews) {
                skritter.data.reviews.add(reviews, {silent: true});
                callback(null, reviews);
            });
        },
        /**
         * Posts the reviews to the server and then removes them from the local database.
         * 
         * @method sync
         * @param {Function} callback
         */
        sync: function(callback) {
            if (this.length > 0) {
                skritter.api.postReviews(this.toJSON(), function(reviews) {
                    if (reviews) {
                        console.log('submitted reviews', reviews);
                        skritter.data.reviews.remove(reviews);
                        callback(reviews.length);
                    } else {
                        callback(0);
                    }
                });
            } else {
                callback(0);
            }
        }
    });

    return StudyReviews;
});
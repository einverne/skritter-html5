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
         * @method filterBy
         * @param {String} attribute
         * @param {String} value
         * @param {Boolean} checkSubString
         * @returns {Array}
         */
        filterBy: function(attribute, value, checkSubString) {
            var filtered = this.filter(function(items) {
                if (checkSubString)
                    return (items.get(attribute).indexOf(value) > -1) ? true : false;
                return _.contains(value, items.get(attribute));
            });
            return new StudyReviews(filtered);
        },
        /**
         * @method getTotalTime
         * @returns {Number}
         */
        getTotalTime: function() {
            var time = 0;
            var filtered = this.filterBy('bearTime', true);
            for (var i in filtered.models)
                time += parseInt(filtered.models[i].get('reviewTime'), 10);
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
                    skritter.data.reviews.remove(reviews);
                    callback();
                });
            } else {
                callback();
            }
        }
    });

    return StudyReviews;
});
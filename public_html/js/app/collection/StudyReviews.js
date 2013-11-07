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
         * Returns a filter array of reviews based if the attribute is equal to
         * the specified value.
         * 
         * @method filterBy
         * @param {String} attribute
         * @param {String} value
         * @returns {StudyReviews} A new collection of filtered StudyReviews
         */
        filterBy: function(attribute, value) {
            var filtered = this.filter(function(reviews) {
                if (reviews.get(attribute) === value)
                    return true;
            });
            return new StudyReviews(filtered);
        },
        /**
         * Returns a count of the current number of reviews and can optionally return
         * the number of contained reviews.
         * 
         * @method getCount
         * @param {Boolean} includeContained
         * @returns {Number}
         */
        getCount: function(includeContained) {
            if (includeContained) {
                return this.length;
            }
            return this.filterBy('bearTime', true).length;
        },
        /**
         * Returns the total time of all local reviews thats haven't been submitted in milliseconds.
         * 
         * @method getTime
         * @returns {Number} Time in milliseconds
         */
        getTime: function() {
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
            Skritter.storage.getItems('reviews', function(reviews) {
                Skritter.data.reviews.add(reviews);
                callback(null, reviews);
            });
        },
        /**
         * @method save
         * @param {Function} callback
         */
        save: function(callback) {
            if (this.length === 0) {
                callback();
                return;
            }
            var reviewModels = [];
            var reviewKeys = [];
            Skritter.api.postReviews(this.toJSON(), Skritter.settings.get('date'), function(reviews) {
                if (reviews.responseText) {
                    callback();
                    return;
                }
                for (var i in reviews) {
                    reviewModels.push(Skritter.data.reviews.findWhere({itemId:reviews[i].itemId, submitTime:reviews[i].submitTime}));
                    reviewKeys.push([reviews[i].itemId, reviews[i].submitTime]);
                }
                Skritter.storage.removeItems('reviews', reviewKeys, function() {
                    Skritter.data.reviews.remove(reviewModels, {silent: true});
                    callback();
                });
            });
        }

    });


    return StudyReviews;
});
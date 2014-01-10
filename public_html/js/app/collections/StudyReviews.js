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
         * @method checkAll
         * @returns {Backbone.Collection}
         */
        checkAll: function() {
            for (var a in this.models) {
                var review = this.models[a];
                if (!review.checkIntegrity()) {
                    var wordGroup = this.where({wordGroup: review.get('wordGroup')});
                    for (var b in wordGroup)
                        this.remove(wordGroup[b]);
                }
            }
            return this;
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
         * @param {Boolean} forceAll
         */
        sync: function(callback, forceAll) {
            if (this.length > 0) {
                var submitReviews;
                if (forceAll) {
                    submitReviews = this.checkAll().toJSON();
                } else {
                    submitReviews = this.checkAll().sort().slice(2, this.length);
                }
                skritter.api.postReviews(submitReviews, function(reviews) {
                    if (reviews) {
                        console.log('submitted reviews', reviews);
                        skritter.data.reviews.remove(reviews);
                        callback(reviews.length);
                    } else {
                        callback(0);
                    }
                });
                callback(0);
            } else {
                callback(0);
            }
        }
    });

    return StudyReviews;
});
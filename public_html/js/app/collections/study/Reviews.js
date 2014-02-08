/**
 * @module Skritter
 * @submodule Collection
 * @param Review
 * @author Joshua McFarland
 */
define([
    'models/study/Review'
], function(Review) {
    /**
     * @class Reviews
     */
    var Reviews = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('add change', function(review) {
                review.cache();
            });
            this.on('remove', function(review) {
                skritter.storage.removeItems('reviews', review.id);
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Review,
        /**
         * @method comparator
         * @param {Backbone.Model} review
         */
        comparator: function(review) {
            return -review.get('id');
        },
        /**
         * @method includeContained
         * @param {Boolean} includContained
         * @returns {Number}
         */
        getCount: function(includContained) {
            if (includContained)
                return this.length;
            return this.where({bearTime: true}).length;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('reviews', function(reviews) {
                skritter.data.reviews.add(reviews, {merge:true, silent: true});
                callback();
            });
        },
        /**
         * @method post
         * @param {Function} callback
         */
        post: function(callback) {
            if (this.length > 0) {
                skritter.api.postReviews(this.toJSON(), function(reviews) {
                    reviews = (reviews) ? reviews : [];
                    console.log('POSTED REVIEWS', reviews);
                    skritter.data.reviews.remove(reviews);
                    callback(reviews.length);
                });
            } else {
                callback(0);
            }
        },
        /**
         * Takes an array of itemIds and removes any associated reviews from the collection. It returns an
         * array of models of the reviews that were removed.
         * 
         * @method removeByItemId
         * @param {Array} itemIds
         * @returns {Array}
         */
        removeByItemId: function(itemIds) {
            var reviews = [];
            for (var i=0; i < this.length; i++)
                if (_.contains(itemIds, this.models[i].get('itemId')))
                    reviews.push(this.models[i]);
            this.remove(reviews);
            return reviews;
        }
    });

    return Reviews;
});
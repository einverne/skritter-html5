/**
 * @module Skritter
 * @submodule Collections
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
            Reviews.this = this;
            this.on('add change', function(review) {
                review.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Review,
        /**
         * @method comparator
         * @param {Backbone.Model} review
         * @returns {Backbone.Model}
         */
        comparator: function(review) {
            return -review.id;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('reviews', function(reviews) {
                Reviews.this.add(reviews, {merge: true, silent: true});
                callback();
            });
        }
    });

    return Reviews;
});
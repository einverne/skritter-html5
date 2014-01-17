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
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('reviews', function(reviews) {
                skritter.data.reviews.add(reviews, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Reviews;
});
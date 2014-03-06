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
            this.on('add', function(review) {
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
         * @method load
         * @param {Number} position
         * @param {Function} callback
         */
        load: function(position, callback) {
            var review = this.at(position);
            if (review) {
                skritter.user.data.loadItem(review.get('base').itemId, function(item) {
                    callback(review, item);
                });
            } else {
                callback();
            }
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            skritter.storage.getAll('reviews', function(reviews) {
                self.add(reviews, {merge: true, silent: true});
                callback();
            });
        }
    });

    return Reviews;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define([
    'require.text!templates/reviews.html'
], function(templateReviews) {
    /**
     * @class Reviews
     */
    var Reviews = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {  
            Reviews.this = this;
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateReviews);
            this.refresh();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click.Reviews #reviews-view #delete-all-button': 'handleDeleteAllClicked',
            'click.Reviews #reviews-view #refresh-button': 'handleRefreshClicked',
            'click.Reviews #reviews-view #sync-button': 'handleSyncClicked'
        },
        /**
         * @method handleClearClicked
         * @param {Function} event
         */
        handleDeleteAllClicked: function(event) {            
            skritter.data.reviews.remove(skritter.data.reviews.toJSON());           
            this.refresh();
            event.preventDefault();
        },
        /**
         * @method handleRefreshClicked
         * @param {Function} event
         */
        handleRefreshClicked: function(event) {
            this.refresh();
            event.preventDefault();
        },
        /**
         * @method handleSyncClicked
         * @param {Function} event
         */
        handleSyncClicked: function(event) {
            event.preventDefault();
        },
        /**
         * @method loadReviews
         */
        refresh: function() {
            skritter.data.reviews.loadAll(function() {
                var div = '';
                skritter.data.reviews.sort();
                var reviews = skritter.data.reviews;
                for (var i in reviews.models) {
                    var review = reviews.at(i);
                    div += (review.get('bearTime')) ? "<tr class='active'>" : '<tr>';
                    div += '<td>' + review.id + '</td>';
                    div += '<td>' + review.get('score') + '</td>';
                    div += '<td>' + review.get('bearTime') + '</td>';
                    div += '<td>' + review.get('reviewTime') + '</td>';
                    div += '<td>' + review.get('thinkingTime') + '</td>';
                    div += '</tr>';
                }
                this.$('#reviews-table tbody').html(div);
            });
        }
    });
    
    return Reviews;
});
/**
 * @module Skritter
 * @submodule Views
 * @param templateReviews
 * @author Joshua McFarland
 */
define([
    'require.text!templates/reviews.html',
    'backbone'
], function(templateReviews) {
    /**
     * @class Reviews
     */
    var Reviews = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateReviews);
            this.load();
            return this;
        },
        /**
         * @method initialize
         */
        load: function() {
            var reviews = skritter.data.reviews;
            var div = '';
            for (var i in reviews.models) {
                var review = reviews.at(i);
                if (review.get('bearTime')) {
                    var item = skritter.data.items.findWhere({id: review.get('itemId')});
                    var vocab = item.getVocabs()[0];
                    var datetime = new Date(review.get('submitTime') * 1000);
                    div += "<tr>";
                    div += "<td class='datetime'>" + datetime + "</td>";
                    div += "<td class='writing'>" + vocab.get('writing') + "</td>";
                    div += "<td class='part'>" + item.get('part') + "</td>";
                    div += "<td class='score'>" + review.get('score') + "</td>";
                    div += "</tr>";
                }
            }
            this.$('#reviews-table tbody').append(div);
        }
    });
    
    return Reviews;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    var DecompTable = Backbone.View.extend({
        initialize: function() {

        },
        render: function() {
            this.$el.html();
            return this;
        }
    });

    return DecompTable;
});
/**
 * @module Skritter
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class VocabsView
     */
    var Vocabs = Backbone.View.extend({
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
            this.$el.html();
            return this;
        }
    });
    
    return Vocabs;
});
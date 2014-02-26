/**
 * @module Skritter
 * @submodule Views
 * @param templateStudy
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study.html'
], function(templateStudy) {
    /**
     * @class Study
     */
    var Study = Backbone.View.extend({
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
            this.$el.html(templateStudy);
            return this;
        }
    });
    
    return Study;
});
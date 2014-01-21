/**
 * @module Skritter
 * @param templateOptions
 * @author Joshua McFarland
 */
define([
    'require.text!templates/options.html'
], function(templateOptions) {
    /**
     * @class Options
     */
    var Options = Backbone.View.extend({
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
            this.$el.html(templateOptions);
            this.$('input').bootstrapSwitch();
            return this;
        }
    });
    
    return Options;
});
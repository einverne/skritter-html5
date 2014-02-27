/**
 * @module Skritter
 * @submodule Views
 * @param GradingButtons
 * @author Joshua McFarland
 */
define([
    'views/prompts/GradingButtons'
], function(GradingButtons) {
    /**
     * @class Prompt
     */
    var Prompt = Backbone.View.extend({
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
            return this;
        }
    });
    
    return Prompt;
});
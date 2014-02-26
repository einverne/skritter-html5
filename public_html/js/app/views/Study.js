/**
 * @module Skritter
 * @submodule Views
 * @param templateStudy
 * @author Joshua McFarland
 */
define([
    'require.text!templates/study.html',
    'views/prompts/Canvas'
], function(templateStudy, Canvas) {
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
            new Canvas().setElement(this.$('.prompt-container')).render();
            return this;
        }
    });
    
    return Study;
});
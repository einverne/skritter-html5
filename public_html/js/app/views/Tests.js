/**
 * Loads the jasmine test framework and specs into view.
 */

/**
 * @module Skritter
 * @submodule Views
 * @param templateTests
 * @author Joshua McFarland
 */
define([
    'require.text!templates/tests.html'
], function(templateTests) {
    /**
     * @class Tests
     */
    var Tests = Backbone.View.extend({
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
            this.$el.html(templateTests);
            require(['jasmine-boot'], function() {
                require([
                    'specs/Functions'
                ], function() {
                    window.runJasmine();
                });
            });
            return this;
        }
    });
    
    return Tests;
});
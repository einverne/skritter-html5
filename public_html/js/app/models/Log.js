/**
 * @module Skritter
 * @submodule Models
 * @author Joshua McFarland
 */
define(function() {
    /**
     * @class Log
     */
    var Log = Backbone.Model.extend({
        /**
         * @method console
         */
        console: function() {
            console.log.apply(console, arguments);
        }
    });

    return Log;
});
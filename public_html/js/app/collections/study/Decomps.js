/**
 * @module Skritter
 * @submodule Collections
 * @param Decomp
 * @author Joshua McFarland
 */
define([
    'models/study/Decomp'
], function(Decomp) {
    /**
     * @class Decomps
     */
    var Decomps = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(decomp) {
                decomp.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Decomp
    });

    return Decomps;
});
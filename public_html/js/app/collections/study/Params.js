/**
 * @module Skritter
 * @submodule Collections
 * @param Param
 * @author Joshua McFarland
 */
define([
    'models/study/Param'
], function(Param) {
    /**
     * @class Params
     */
    var Params = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add(skritter.fn.params);
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Param
    });

    return Params;
});
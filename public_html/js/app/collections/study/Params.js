/**
 * @module Skritter
 * @submodule Collections
 * @param Param
 * @param ParamMap
 * @author Joshua McFarland
 */
define([
    'models/study/Param',
    'ParamMap'
], function(Param, ParamMap) {
    /**
     * @class Params
     */
    var Params = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add(ParamMap);
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Param
    });

    return Params;
});
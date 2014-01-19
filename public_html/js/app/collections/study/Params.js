/**
 * @module Skritter
 * @submodule Collection
 * @param ParamList
 * @param Param
 * @author Joshua McFarland
 */
define([
    'ParamList',
    'models/study/Param'
], function(ParamList, Param) {
    /**
     * @class Params
     */
    var Params = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.add(ParamList);
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Param
    });

    return Params;
});
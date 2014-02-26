/**
 * @module Skritter
 * @submodule Collections
 * @param CanvasStroke
 * @author Joshua McFarland
 */
define([
    'models/study/CanvasStroke'
], function(CanvasStroke) {
    /**
     * @class CanvasCharacter
     */
    var CanvasCharacter = Backbone.Collection.extend({
        /**
         * @property {CanvasStroke} model
         */
        model: CanvasStroke
    });

    return CanvasCharacter;
});
/**
 * @module Skritter
 * @submodule Collections
 * @param Stroke
 * @author Joshua McFarland
 */
define([
    'models/prompts/Stroke'
], function(Stroke) {
    /**
     * @class PromptCharacter
     */
    var Character = Backbone.Collection.extend({
        /**
         * @property {CanvasStroke} model
         */
        model: Stroke
    });

    return Character;
});
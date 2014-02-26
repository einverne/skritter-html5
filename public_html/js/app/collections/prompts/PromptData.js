/**
 * @module Skritter
 * @submodule Collections
 * @param PromptItem
 * @author Joshua McFarland
 */
define([
    'models/study/PromptItem'
], function(PromptItem) {
    /**
     * @class PromptData
     */
    var PromptData = Backbone.Collection.extend({
        /**
         * @property {Backbone.Model} model
         */
        model: PromptItem
    });

    return PromptData;
}); 
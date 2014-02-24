/**
 * @module Skritter
 * @submodule Collections
 * @param Sentence
 * @author Joshua McFarland
 */
define([
    'models/study/Sentence'
], function(Sentence) {
    /**
     * @class Sentences
     */
    var Sentences = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(sentence) {
                sentence.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Sentence
    });

    return Sentences;
});
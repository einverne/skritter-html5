/**
 * @module Skritter
 * @submodule Collection
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
        model: Sentence,
        /**
         * @method insert
         * @param {Array} sentences
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(sentences, callback) {
            if (sentences) {
                skritter.data.sentences.add(sentences, {merge: true, silent: true});
                skritter.storage.setItems('sentences', sentences, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('sentences', function(sentences) {
                skritter.data.sentences.add(sentences, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Sentences;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param StudySentence
 * @author Joshua McFarland
 */
define([
    'models/StudySentence',
    'backbone'
], function(StudySentence) {
    /**
     * @class StudySentences
     */
    var StudySentences = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(sentence) {
                sentence.cache();
            });
        },
        /**
         * @property {StudySentence} model
         */
        model: StudySentence,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('sentences', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method insert
         * @param {Array} sentences
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(sentences, callback) {
            if (sentences) {
                this.add(sentences, {merge: true});
                skritter.storage.setItems('sentences', sentences, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('sentences', function(sentences) {
                skritter.data.sentences.add(sentences, {silent: true});
                callback(null, sentences);
            });
        }
    });

    return StudySentences;
});
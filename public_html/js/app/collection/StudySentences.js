/**
 * @module Skritter
 * @submodule Collection
 * @param StudySentence
 * @author Joshua McFarland
 */
define([
    'model/StudySentence',
    'backbone'
], function(StudySentence) {
    /**
     * @class StudySentences
     */
    var StudySentences = Backbone.Collection.extend({
        /**
         * @property {StudySentence} model
         */
        model: StudySentence,
        /**
         * @method cache
         * @param {Function} callback
         * @returns {undefined}
         */
        cache: function(callback) {
            if (this.length === 0) {
                callback();
                return;
            }
            Skritter.storage.setItems('sentences', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method loadAll
         * @param {Function} callback
         * @returns {undefined}
         */
        loadAll: function(callback) {
            Skritter.storage.getItems('sentences', function(sentences) {
                Skritter.study.sentences.add(sentences);
                callback(null, sentences);
            });
        }

    });


    return StudySentences;
});
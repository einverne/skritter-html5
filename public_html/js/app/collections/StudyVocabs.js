/**
 * @module Skritter
 * @submodule Collection
 * @param StudyVocab
 * @author Joshua McFarland
 */
define([
    'models/StudyVocab',
    'backbone'
], function(StudyVocab) {
    /**
     * @class StudyVocabs
     */
    var StudyVocabs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(vocab) {
                vocab.cache();
            });
        },
        /**
         * @property {StudyVocab} model
         */
        model: StudyVocab,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('vocabs', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method insert
         * @param {Array} vocabs
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(vocabs, callback) {
            this.add(vocabs, {merge: true});
            skritter.storage.setItems('vocabs', vocabs, callback);
            return this;
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocabs', function(vocabs) {
                skritter.data.vocabs.add(vocabs, {silent: true});
                callback(null, vocabs);
            });
        }
    });

    return StudyVocabs;
});
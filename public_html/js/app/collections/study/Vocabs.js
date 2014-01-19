/**
 * @module Skritter
 * @submodule Collection
 * @param Vocab
 * @author Joshua McFarland
 */
define([
    'models/study/Vocab'
], function(Vocab) {
    /**
     * @class Vocabs
     */
    var Vocabs = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(vocab) {
                vocab.cache();
            });
        },
        /**
         * @property {Vocab} model
         */
        model: Vocab,
        /**
         * @method insert
         * @param {Array} vocabs
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(vocabs, callback) {
            if (vocabs) {
                skritter.data.vocabs.add(vocabs, {merge: true, silent: true});
                skritter.storage.setItems('vocabs', vocabs, callback);
            } else {
                callback();
            }
            return this;
        },
        /**
         * @method load
         * @param {String} id
         * @param {Function} callback
         */
        load: function(id, callback) {
            var vocab = this.get(id);
            if (vocab) {
                callback(vocab);
            } else {
                skritter.storage.getItems('vocabs', id, _.bind(function(item) {
                    callback(this.add(item, {merge: true, silent: true})[0]);
                }, this));
            }
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('vocabs', function(vocabs) {
                skritter.data.vocabs.add(vocabs, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Vocabs;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param StudyDecomp
 * @author Joshua McFarland
 */
define([
    'models/StudyDecomp',
    'backbone'
], function(StudyDecomp) {
    /**
     * @class StudyDecomps
     */
    var StudyDecomps = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(decomp) {
                decomp.cache();
            });
        },
        /**
         * @property {StudyDecomp} model
         */
        model: StudyDecomp,
        /**
         * @method cache
         * @param {Callback} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('decomps', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method insert
         * @param {Array} decomps
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(decomps, callback) {
            if (decomps) {
                skritter.data.decomps.add(decomps, {merge: true, silent: true, sort: false});
                skritter.storage.setItems('decomps', decomps, callback);
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
            skritter.storage.getAll('decomps', function(decomps) {
                skritter.data.decomps.add(decomps, {silent: true});
                callback(null, decomps);
            });
        }
    });

    return StudyDecomps;
});
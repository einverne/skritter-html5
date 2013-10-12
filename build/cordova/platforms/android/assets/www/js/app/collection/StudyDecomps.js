/**
 * @module Skritter
 * @submodule Collection
 * @param StudyDecomp
 * @author Joshua McFarland
 */
define([
    'model/StudyDecomp',
    'backbone'
], function(StudyDecomp) {
    /**
     * @class StudyDecomps
     */
    var StudyDecomps = Backbone.Collection.extend({
        /**
         * @property {StudyDecomp} model
         */
        model: StudyDecomp,
        /**
         * @method cache
         * @param {Callback} callback
         * @returns {undefined}
         */
        cache: function(callback) {
            if (this.length === 0) {
                callback();
                return;
            }
            Skritter.storage.setItems('decomps', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        },
        /**
         * @method loadAll
         * @param {Callback} callback
         * @returns {undefined}
         */
        loadAll: function(callback) {
            Skritter.storage.getItems('decomps', function(decomps) {
                Skritter.study.decomps.add(decomps);
                callback(null, decomps);
            });
        }

    });


    return StudyDecomps;
});
/**
 * @module Skritter
 * @submodule Collection
 * @param Decomp
 * @author Joshua McFarland
 */
define([
    'models/study/Decomp'
], function(Decomp) {
    /**
     * @class Decomps
     */
    var Decomps = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.on('change', function(decomp) {
                decomp.cache();
            });
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Decomp,
        /**
         * @method insert
         * @param {Array} decomps
         * @param {Function} callback
         * @returns {Backbone.Collection}
         */
        insert: function(decomps, callback) {
            if (decomps) {
                skritter.data.decomps.add(decomps, {merge: true, silent: true});
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
                skritter.data.decomps.add(decomps, {merge:true, silent: true});
                callback();
            });
        }
    });

    return Decomps;
});
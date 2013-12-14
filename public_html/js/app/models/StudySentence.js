/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class StudySentence
     */
    var StudySentence = Backbone.Model.extend({
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('sentences', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });

    return StudySentence;
});
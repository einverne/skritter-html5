/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class StudyStroke
     */
    var StudyStroke = Backbone.Model.extend({
        /**
         * @property {String} idAttribute
         */
        idAttribute: 'rune',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('strokes', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });

    return StudyStroke;
});
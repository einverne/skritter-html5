/**
 * @module Skritter
 * @submodule Model
 * @author Joshua McFarland
 */
define([
    'backbone'
], function() {
    /**
     * @class StudyDecomp
     */
    var StudyDecomp = Backbone.Model.extend({    
	/**
         * @property {String} idAttribute
         */
        idAttribute: 'writing',
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.setItems('decomps', this.toJSON(), function() {
                if (typeof callback === 'function')
                    callback();
            });
        }
    });
    
    return StudyDecomp;
});
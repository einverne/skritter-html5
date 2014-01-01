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
        },
        /**
         * @method getDefinition
         * @returns {undefined}
         */
        getDefinition: function() {
            var definition = this.get('definitions')[skritter.user.getSetting('sourceLang')];
            if (typeof definition === 'undefined')
                return this.get('definitions').en;
            return definition;
        },
        /**
         * @method noWhiteSpaces
         * @returns {undefined}
         */
        noWhiteSpaces: function() {
            return this.get('writing').replace(/ /g,'');
        }
    });

    return StudySentence;
});